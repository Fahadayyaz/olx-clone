import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { FiCamera, FiX } from "react-icons/fi";

const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Abbottabad",
  "Mardan",
  "Sahiwal",
];

export default function PostAd() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    condition: "",
    city: "Lahore",
    area: "",
    province: "Punjab",
    phone: "",
  });

  useEffect(() => {
    API.get("/ads/categories").then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "category") {
      const cat = categories.find((c) => c._id === value);
      setSubcategories(cat?.subcategories || []);
      setForm((prev) => ({ ...prev, subcategory: "" }));
    }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 8) {
      toast.error("Maximum 8 images allowed");
      return;
    }
    setImages([...images, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
    setPreviews(previews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error("Please select a category");
    if (images.length === 0)
      return toast.error("Please add at least one image");

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      images.forEach((img) => data.append("images", img));

      const res = await API.post("/ads", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Ad posted successfully!");
      navigate(`/ad/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-ad-page container">
      <div className="post-ad-card">
        <h2>POST YOUR AD</h2>

        <form onSubmit={handleSubmit}>
          {/* Images */}
          <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
            Upload up to 8 photos
          </label>
          <div
            className="image-upload-area"
            onClick={() => document.getElementById("ad-images").click()}
          >
            <FiCamera size={40} color="#7f9799" />
            <p style={{ color: "#7f9799", marginTop: 8 }}>
              Click to add photos ({images.length}/8)
            </p>
            <input
              id="ad-images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              style={{ display: "none" }}
            />
          </div>

          {previews.length > 0 && (
            <div className="image-previews">
              {previews.map((src, i) => (
                <div key={i} className="image-preview">
                  <img src={src} alt="" />
                  <button type="button" onClick={() => removeImage(i)}>
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Category */}
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {subcategories.length > 0 && (
            <div className="form-group">
              <label>Subcategory</label>
              <select
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label>Ad Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Mention key features (e.g. brand, model, age, type)"
              maxLength={70}
              required
            />
            <small style={{ color: "#7f9799" }}>{form.title.length}/70</small>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Include condition, features and reason for selling"
              rows={6}
              maxLength={4096}
              required
            />
          </div>

          {/* Condition */}
          <div className="form-group">
            <label>Condition</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price (PKR) *</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price in PKR"
              min={0}
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>City *</label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Area / Neighbourhood</label>
            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="e.g. DHA Phase 5"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="03XX-XXXXXXX"
            />
          </div>

          <button className="btn btn-sell" disabled={loading}>
            {loading ? "Posting..." : "Post Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
