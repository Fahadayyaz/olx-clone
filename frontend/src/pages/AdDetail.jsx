import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  FiHeart,
  FiShare2,
  FiMapPin,
  FiEye,
  FiPhone,
  FiMessageSquare,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { format } from "timeago.js";
import { toast } from "react-toastify";

export default function AdDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [mainImg, setMainImg] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/ads/${id}`)
      .then((res) => setAd(res.data))
      .catch(() => toast.error("Ad not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleFav = async () => {
    if (!user) return navigate("/login");
    await API.put(`/ads/${id}/favorite`);
    setAd((prev) => {
      const isFav = prev.favorites?.includes(user._id);
      return {
        ...prev,
        favorites: isFav
          ? prev.favorites.filter((fId) => fId !== user._id)
          : [...prev.favorites, user._id],
      };
    });
  };

  const startChat = async () => {
    if (!user) return navigate("/login");
    try {
      const res = await API.post("/chats", {
        adId: ad._id,
        sellerId: ad.seller._id,
      });
      navigate("/chats", { state: { activeChatId: res.data._id } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Cannot start chat");
    }
  };

  if (loading) return <div className="spinner" />;
  if (!ad) return <div className="empty-state">Ad not found</div>;

  const isFav = user && ad.favorites?.includes(user._id);
  const placeholder = "https://via.placeholder.com/800x600.png?text=No+Image";

  return (
    <div className="container ad-detail-page">
      <div className="ad-detail-grid">
        {/* Left — Images */}
        <div>
          <div className="ad-images">
            <img
              src={ad.images?.[mainImg] || placeholder}
              alt={ad.title}
              className="main-image"
            />
            {ad.images?.length > 1 && (
              <div className="image-thumbnails">
                {ad.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className={mainImg === i ? "active" : ""}
                    onClick={() => setMainImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="description-box">
            <h3>Description</h3>
            <p>{ad.description}</p>
          </div>
        </div>

        {/* Right — Info */}
        <div>
          <div className="ad-info">
            {ad.isFeatured && (
              <span
                className="featured-badge"
                style={{
                  position: "static",
                  marginBottom: 12,
                  display: "inline-block",
                }}
              >
                ⭐ FEATURED
              </span>
            )}
            <div className="ad-price">Rs {ad.price?.toLocaleString()}</div>
            <div className="ad-title-detail">{ad.title}</div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <button className="btn btn-outline" onClick={toggleFav}>
                {isFav ? <FaHeart color="#ff4444" /> : <FiHeart />}
                {isFav ? " Saved" : " Save"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
              >
                <FiShare2 /> Share
              </button>
            </div>

            <div className="ad-detail-meta">
              <span>
                <FiMapPin /> {ad.location?.city}
                {ad.location?.area ? `, ${ad.location.area}` : ""}
              </span>
              <span>{format(ad.createdAt)}</span>
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: "#7f9799" }}>
              <FiEye /> {ad.views} views
              {ad.condition && (
                <>
                  {" "}
                  &bull; Condition: <strong>{ad.condition}</strong>
                </>
              )}
            </div>
          </div>

          {/* Seller Card */}
          <div className="seller-card">
            <div className="seller-info">
              <img
                src={
                  ad.seller?.avatar ||
                  `https://ui-avatars.com/api/?name=${ad.seller?.name}&background=23e5db&color=002f34&size=56`
                }
                alt=""
                className="seller-avatar"
              />
              <div>
                <div className="seller-name">{ad.seller?.name}</div>
                <div className="seller-since">
                  Member since{" "}
                  {new Date(ad.seller?.memberSince).toLocaleDateString(
                    "en-PK",
                    {
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </div>
              </div>
            </div>

            {/* Phone */}
            {(ad.phone || ad.seller?.phone) && (
              <button
                className="btn btn-primary"
                style={{ marginBottom: 12 }}
                onClick={() => setShowPhone(true)}
              >
                <FiPhone />
                {showPhone ? ad.phone || ad.seller?.phone : "Show phone number"}
              </button>
            )}

            {/* Chat */}
            {user?._id !== ad.seller?._id && (
              <button
                className="btn btn-outline"
                style={{ width: "100%" }}
                onClick={startChat}
              >
                <FiMessageSquare /> Chat with Seller
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
