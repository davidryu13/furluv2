// src/components/AuthNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function AuthNavbar() {
  return (
    <header className="auth-navbar">
      <div className="auth-nav-left">
        <Link to="/" className="landing-brand">FurLuv</Link>
      </div>
      <div className="auth-nav-center">
        <Link to="/landing" className="btn-home">Home</Link>
      </div>
    </header>
  );
}
