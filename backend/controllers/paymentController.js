const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Ad = require("../models/Ad");

// POST /api/payments/create-checkout
exports.createCheckoutSession = async (req, res) => {
  try {
    const { adId, plan } = req.body;

    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    if (ad.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const plans = {
      "7days": { price: 50000, label: "Featured 7 Days", days: 7 }, // PKR 500 = 50000 paisa
      "15days": { price: 90000, label: "Featured 15 Days", days: 15 },
      "30days": { price: 150000, label: "Featured 30 Days", days: 30 },
    };

    const selected = plans[plan];
    if (!selected) return res.status(400).json({ message: "Invalid plan" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: selected.label,
              description: `Make your ad "${ad.title}" featured for ${selected.days} days`,
            },
            unit_amount: selected.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/my-ads?featured=success`,
      cancel_url: `${process.env.CLIENT_URL}/my-ads?featured=cancel`,
      metadata: {
        adId: ad._id.toString(),
        days: selected.days.toString(),
        userId: req.user._id.toString(),
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/payments/webhook
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { adId, days } = session.metadata;

    const featuredUntil = new Date();
    featuredUntil.setDate(featuredUntil.getDate() + parseInt(days));

    await Ad.findByIdAndUpdate(adId, {
      isFeatured: true,
      featuredUntil,
    });

    console.log(`Ad ${adId} featured until ${featuredUntil}`);
  }

  res.json({ received: true });
};
