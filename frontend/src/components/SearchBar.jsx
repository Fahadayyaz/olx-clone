import React from "react";

export default function SearchBar({ filters, setFilters }) {
  return (
    <div
      style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}
    >
      <select
        value={filters.condition || ""}
        onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
        style={{
          padding: "8px 12px",
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      >
        <option value="">All Conditions</option>
        <option value="new">New</option>
        <option value="used">Used</option>
        <option value="refurbished">Refurbished</option>
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={filters.minPrice || ""}
        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        style={{
          padding: "8px 12px",
          borderRadius: 4,
          border: "1px solid #ccc",
          width: 120,
        }}
      />

      <input
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice || ""}
        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        style={{
          padding: "8px 12px",
          borderRadius: 4,
          border: "1px solid #ccc",
          width: 120,
        }}
      />

      <select
        value={filters.sort || "-createdAt"}
        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        style={{
          padding: "8px 12px",
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      >
        <option value="-createdAt">Newest First</option>
        <option value="createdAt">Oldest First</option>
        <option value="price">Price: Low to High</option>
        <option value="-price">Price: High to Low</option>
      </select>
    </div>
  );
}
