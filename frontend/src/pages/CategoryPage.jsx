import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import AdCard from "../components/AdCard";
import CategoryBar from "../components/CategoryBar";
import SearchBar from "../components/SearchBar";

export default function CategoryPage() {
  const { slug } = useParams();
  const [ads, setAds] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setLoading(true);
    API.get("/ads/categories").then((res) => {
      const cat = res.data.find((c) => c.slug === slug);
      setCategory(cat);
      if (cat) {
        const params = new URLSearchParams({
          category: cat._id,
          ...filters,
        });
        API.get(`/ads?${params}`).then((r) => {
          setAds(r.data.ads);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [slug, filters]);

  return (
    <>
      <CategoryBar />
      <div className="container">
        <h2 className="section-title">
          {category?.icon} {category?.name || "Category"}
        </h2>

        <SearchBar filters={filters} setFilters={setFilters} />

        {loading ? (
          <div className="spinner" />
        ) : ads.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p>No ads found in this category</p>
          </div>
        ) : (
          <div className="ads-grid">
            {ads.map((ad) => (
              <AdCard key={ad._id} ad={ad} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
