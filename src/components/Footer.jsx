// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-brand">FurLuv</div>
          <p className="footer-tag">Bringing pet lovers together</p>
        </div>

        <div className="footer-links">
          <Link to="/landing" className="footer-link">Home</Link>
          <a href="#about" className="footer-link">About Us</a>
          <a href="#support" className="footer-link">Support</a>
          <a href="#contact" className="footer-link">Contact</a>
        </div>

        <div className="footer-social">
          <span>© {new Date().getFullYear()} FurLuv</span>
        </div>
      </div>
    </footer>
  );
}
