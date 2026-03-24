import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h4>Popular Categories</h4>
          <Link to="/category/mobiles">Mobiles</Link>
          <Link to="/category/vehicles">Cars</Link>
          <Link to="/category/property-sale">Property</Link>
          <Link to="/category/electronics">Electronics</Link>
          <Link to="/category/bikes">Bikes</Link>
        </div>
        <div className="footer-col">
          <h4>Trending Searches</h4>
          <Link to="/search?q=iphone">iPhone</Link>
          <Link to="/search?q=toyota">Toyota Cars</Link>
          <Link to="/search?q=honda">Honda Bikes</Link>
          <Link to="/search?q=samsung">Samsung</Link>
        </div>
        <div className="footer-col">
          <h4>About Us</h4>
          <a href="#">About zill Group</a>
          <a href="#">Careers</a>
          <a href="#">Contact Us</a>
          <a href="#">zill Blog</a>
        </div>
        <div className="footer-col">
          <h4>zill</h4>
          <a href="#">Help</a>
          <a href="#">Sitemap</a>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Free Classifieds in Pakistan. © 2024 zill </p>
      </div>
    </footer>
  );
}
