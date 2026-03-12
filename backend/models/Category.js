const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: "📦" },
  image: { type: String, default: "" },
  subcategories: [
    {
      name: { type: String, required: true },
      slug: { type: String, required: true },
    },
  ],
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model("Category", categorySchema);
