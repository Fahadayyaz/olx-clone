const router = require("express").Router();
const ctrl = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");
const express = require("express");

router.post("/create-checkout", protect, ctrl.createCheckoutSession);

// Stripe webhook needs raw body
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  ctrl.stripeWebhook,
);

module.exports = router;
