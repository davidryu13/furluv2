// src/components/LandingNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function LandingNavbar() {
  return (
    <header className="landing-navbar">
      <div className="landing-nav-left">
        <Link to="/" className="landing-brand">FurLuv</Link>
      </div>

      <nav className="landing-nav-right">
        {/* Home goes to login as requested */}
        <Link to="/landing" className="nav-link">Home</Link>

        {/* Anchor links scroll to sections in Landing.jsx */}
        <a href="#about" className="nav-link">About Us</a>
        <a href="#support" className="nav-link">Support</a>
      </nav>
    </header>
  );
}
