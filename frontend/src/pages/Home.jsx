import React, { useEffect, useState } from "react";
import API from "../api/axios";
import AdCard from "../components/AdCard";
import CategoryBar from "../components/CategoryBar";
import { Link } from "react-router-dom";

export default function Home() {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [adsRes, catRes] = await Promise.all([
        API.get("/ads?limit=24"),
        API.get("/ads/categories"),
      ]);
      setAds(adsRes.data.ads);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFavToggle = (adId) => {
    setAds((prev) =>
      prev.map((ad) => {
        if (ad._id === adId) {
          const user = JSON.parse(localStorage.getItem("zill_user"));
          const isFav = ad.favorites?.includes(user?._id);
          return {
            ...ad,
            favorites: isFav
              ? ad.favorites.filter((id) => id !== user._id)
              : [...(ad.favorites || []), user._id],
          };
        }
        return ad;
      }),
    );
  };

  return (
    <>
      <CategoryBar />

      <div className="home-hero">
        <h1>Buy & Sell Anything in Pakistan</h1>
        <p>Pakistan's #1 marketplace — Free classifieds</p>
      </div>

      <div className="container">
        {/* Categories Grid */}
        <h2 className="section-title">Browse Categories</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link key={cat._id} to={`/category/${cat.slug}`}>
              <div className="category-card">
                <div className="icon">{cat.icon}</div>
                <div className="name">{cat.name}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Fresh Recommendations */}
        <h2 className="section-title">Fresh Recommendations</h2>
        {loading ? (
          <div className="spinner" />
        ) : ads.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <p>No ads yet. Be the first to post!</p>
          </div>
        ) : (
          <div className="ads-grid">
            {ads.map((ad) => (
              <AdCard key={ad._id} ad={ad} onFavToggle={handleFavToggle} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
