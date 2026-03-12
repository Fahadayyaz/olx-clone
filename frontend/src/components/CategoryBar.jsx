import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function CategoryBar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/ads/categories").then((res) => setCategories(res.data));
  }, []);

  return (
    <div className="category-bar">
      <div className="category-bar-inner">
        <Link to="/" className="cat-link">
          ALL CATEGORIES
        </Link>
        {categories.map((cat) => (
          <Link key={cat._id} to={`/category/${cat.slug}`} className="cat-link">
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
