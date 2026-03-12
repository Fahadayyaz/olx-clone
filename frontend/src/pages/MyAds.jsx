import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { FiTrash2, FiStar, FiEdit } from "react-icons/fi";

export default function MyAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/ads/user/my-ads")
      .then((res) => setAds(res.data))
      .finally(() => setLoading(false));
  }, []);

  const deleteAd = async (id) => {
    if (!window.confirm("Delete this ad?")) return;
    await API.delete(`/ads/${id}`);
    setAds(ads.filter((a) => a._id !== id));
    toast.success("Ad deleted");
  };

  const markSold = async (id) => {
    await API.put(`/ads/${id}`, { status: "sold" });
    setAds(ads.map((a) => (a._id === id ? { ...a, status: "sold" } : a)));
    toast.success("Marked as sold");
  };

  const placeholder = "https://via.placeholder.com/160x120.png?text=No+Image";

  if (loading) return <div className="spinner" />;

  return (
    <div className="container my-ads-page">
      <h2 className="section-title">My Ads</h2>

      {ads.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📦</div>
          <p>You haven't posted any ads yet.</p>
          <Link to="/post-ad">
            <button
              className="btn btn-primary"
              style={{ marginTop: 16, width: "auto" }}
            >
              Post Your First Ad
            </button>
          </Link>
        </div>
      ) : (
        ads.map((ad) => (
          <div key={ad._id} className="my-ad-item">
            <img
              src={ad.images?.[0] || placeholder}
              alt={ad.title}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/ad/${ad._id}`)}
            />
            <div className="my-ad-info">
              <h3>{ad.title}</h3>
              <p style={{ fontWeight: 700, fontSize: 18 }}>
                Rs {ad.price?.toLocaleString()}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <span className={`status-badge status-${ad.status}`}>
                  {ad.status}
                </span>
                {ad.isFeatured && (
                  <span
                    className="status-badge"
                    style={{ background: "#fff6e0", color: "#b8860b" }}
                  >
                    ⭐ Featured
                  </span>
                )}
                <span style={{ fontSize: 12, color: "#7f9799" }}>
                  {ad.views} views
                </span>
              </div>
            </div>
            <div className="my-ad-actions">
              {ad.status === "active" && (
                <>
                  <button
                    className="btn btn-featured"
                    onClick={() => navigate(`/featured/${ad._id}`)}
                    title="Make Featured"
                  >
                    <FiStar />
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => markSold(ad._id)}
                  >
                    Sold
                  </button>
                </>
              )}
              <button
                className="btn btn-danger"
                onClick={() => deleteAd(ad._id)}
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
