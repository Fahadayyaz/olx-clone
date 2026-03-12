const Ad = require("../models/Ad");
const Category = require("../models/Category");

// GET /api/ads
exports.getAds = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      city,
      minPrice,
      maxPrice,
      condition,
      sort = "-createdAt",
      search,
    } = req.query;

    const query = { status: "active" };

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (city) query["location.city"] = new RegExp(city, "i");
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const total = await Ad.countDocuments(query);

    // Featured ads first, then by sort
    const ads = await Ad.find(query)
      .populate("category", "name slug icon")
      .populate("seller", "name avatar memberSince")
      .sort({
        isFeatured: -1,
        [sort.replace("-", "")]: sort.startsWith("-") ? -1 : 1,
      })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      ads,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/ads/:id
exports.getAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
      .populate("category", "name slug icon subcategories")
      .populate("seller", "name email phone avatar memberSince location");

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // Increment views
    ad.views += 1;
    await ad.save();

    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/ads
exports.createAd = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      subcategory,
      condition,
      city,
      area,
      province,
      phone,
    } = req.body;

    const images = req.files ? req.files.map((f) => f.path) : [];

    const ad = await Ad.create({
      title,
      description,
      price: Number(price),
      category,
      subcategory,
      condition,
      images,
      location: { city, area, province },
      phone,
      seller: req.user._id,
    });

    const populated = await ad.populate("category", "name slug icon");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/ads/:id
exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    if (ad.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => f.path);
      updates.images = [...(ad.images || []), ...newImages];
    }

    if (updates.city || updates.area || updates.province) {
      updates.location = {
        city: updates.city || ad.location.city,
        area: updates.area || ad.location.area,
        province: updates.province || ad.location.province,
      };
    }

    const updated = await Ad.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate("category", "name slug icon");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/ads/:id
exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    if (ad.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await ad.deleteOne();
    res.json({ message: "Ad deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/ads/user/my-ads
exports.getMyAds = async (req, res) => {
  try {
    const ads = await Ad.find({ seller: req.user._id })
      .populate("category", "name slug icon")
      .sort("-createdAt");
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/ads/:id/favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    const idx = ad.favorites.indexOf(req.user._id);
    if (idx > -1) {
      ad.favorites.splice(idx, 1);
    } else {
      ad.favorites.push(req.user._id);
    }
    await ad.save();
    res.json({ favorites: ad.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/ads/favorites
exports.getFavorites = async (req, res) => {
  try {
    const ads = await Ad.find({ favorites: req.user._id })
      .populate("category", "name slug icon")
      .populate("seller", "name avatar")
      .sort("-createdAt");
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort("order");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
