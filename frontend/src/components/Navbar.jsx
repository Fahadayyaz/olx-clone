import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiMapPin,
  FiSearch,
  FiMessageSquare,
  FiHeart,
  FiUser,
  FiPlus,
  FiLogOut,
} from "react-icons/fi";
import LocationModal from "./LocationModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Pakistan");
  const [showLocation, setShowLocation] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}&city=${city}`);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-top">
          <Link to="/" className="navbar-logo">
            zill<span>.</span>
          </Link>

          <button
            className="location-btn"
            onClick={() => setShowLocation(true)}
          >
            <FiMapPin /> {city}
          </button>

          <form className="search-container" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Find Cars, Mobile Phones and more..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">
              <FiSearch />
            </button>
          </form>

          <div className="navbar-actions">
            {user ? (
              <>
                <Link to="/chats" className="nav-link">
                  <FiMessageSquare size={20} />
                </Link>
                <Link to="/my-ads" className="nav-link">
                  <FiHeart size={20} />
                </Link>
                <Link to="/profile" className="nav-link">
                  <FiUser size={20} /> {user.name?.split(" ")[0]}
                </Link>
                <button
                  className="nav-link"
                  onClick={logout}
                  style={{ background: "none", border: "none" }}
                >
                  <FiLogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            )}

            <Link to="/post-ad">
              <button className="sell-btn">
                <FiPlus /> SELL
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {showLocation && (
        <LocationModal
          onSelect={(c) => {
            setCity(c);
            setShowLocation(false);
          }}
          onClose={() => setShowLocation(false)}
        />
      )}
    </>
  );
}
