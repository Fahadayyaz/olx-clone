import React from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { format } from "timeago.js";

export default function AdCard({ ad, onFavToggle }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isFav = user && ad.favorites?.includes(user._id);

  const toggleFav = async (e) => {
    e.stopPropagation();
    if (!user) return navigate("/login");
    try {
      await API.put(`/ads/${ad._id}/favorite`);
      if (onFavToggle) onFavToggle(ad._id);
    } catch (err) {
      console.error(err);
    }
  };

  const placeholder = "https://via.placeholder.com/400x300.png?text=No+Image";

  return (
    <div
      className={`ad-card ${ad.isFeatured ? "featured" : ""}`}
      onClick={() => navigate(`/ad/${ad._id}`)}
    >
      {ad.isFeatured && <span className="featured-badge">⭐ FEATURED</span>}

      <button className="fav-btn" onClick={toggleFav}>
        {isFav ? <FaHeart color="#ff4444" /> : <FiHeart color="#002f34" />}
      </button>

      <img
        src={ad.images?.[0] || placeholder}
        alt={ad.title}
        className="ad-card-img"
        loading="lazy"
      />

      <div className="ad-card-body">
        <div className="ad-card-price">Rs {ad.price?.toLocaleString()}</div>
        <div className="ad-card-title">{ad.title}</div>
        <div className="ad-card-meta">
          <span>{ad.location?.city}</span>
          <span>{format(ad.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
