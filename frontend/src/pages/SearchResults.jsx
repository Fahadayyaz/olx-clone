import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import AdCard from "../components/AdCard";
import SearchBar from "../components/SearchBar";
import CategoryBar from "../components/CategoryBar";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const city = params.get("city") || "";
  const [ads, setAds] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setLoading(true);
    const searchParams = new URLSearchParams({
      search: query,
      ...(city && city !== "Pakistan" ? { city } : {}),
      ...filters,
    });
    API.get(`/ads?${searchParams}`)
      .then((res) => {
        setAds(res.data.ads);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  }, [query, city, filters]);

  return (
    <>
      <CategoryBar />
      <div className="container">
        <h2 className="section-title">
          {total} results for "{query}"
          {city && city !== "Pakistan" ? ` in ${city}` : ""}
        </h2>

        <SearchBar filters={filters} setFilters={setFilters} />

        {loading ? (
          <div className="spinner" />
        ) : ads.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p>No ads match your search</p>
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
