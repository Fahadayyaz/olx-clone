const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 70 },
    description: { type: String, required: true, maxlength: 4096 },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: { type: String, default: "" },
    condition: {
      type: String,
      enum: ["new", "used", "refurbished", ""],
      default: "",
    },
    images: [{ type: String }],
    location: {
      city: { type: String, required: true },
      area: { type: String, default: "" },
      province: { type: String, default: "" },
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    featuredUntil: { type: Date },
    status: {
      type: String,
      enum: ["active", "sold", "inactive", "pending"],
      default: "active",
    },
    views: { type: Number, default: 0 },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

adSchema.index({ title: "text", description: "text" });
adSchema.index({ "location.city": 1, category: 1, price: 1, createdAt: -1 });

module.exports = mongoose.model("Ad", adSchema);
