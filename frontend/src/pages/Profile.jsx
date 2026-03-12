import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, setUser, login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    province: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        city: user.location?.city || "",
        province: user.location?.province || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/auth/profile", form);
      login({ ...res.data, token: user.token });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container profile-page">
      <div className="profile-card">
        <div className="profile-avatar-section">
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${user?.name}&background=23e5db&color=002f34&size=80`
            }
            alt=""
          />
          <div>
            <h2>{user?.name}</h2>
            <p style={{ color: "#7f9799", fontSize: 14 }}>{user?.email}</p>
            <p style={{ color: "#7f9799", fontSize: 12 }}>
              Member since{" "}
              {new Date(
                user?.memberSince || user?.createdAt,
              ).toLocaleDateString("en-PK", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="03XX-XXXXXXX"
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Province</label>
            <select
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
            >
              <option value="">Select</option>
              <option value="Punjab">Punjab</option>
              <option value="Sindh">Sindh</option>
              <option value="KPK">Khyber Pakhtunkhwa</option>
              <option value="Balochistan">Balochistan</option>
              <option value="Islamabad">Islamabad Capital</option>
              <option value="AJK">Azad Kashmir</option>
              <option value="GB">Gilgit-Baltistan</option>
            </select>
          </div>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
