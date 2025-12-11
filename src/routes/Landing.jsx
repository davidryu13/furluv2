// src/routes/Landing.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavBar";
import Footer from "../components/Footer";
import "../styles/landing.css";

export default function Landing() {
  const [supportForm, setSupportForm] = useState({ name: "", email: "", message: "" });
  const [supportStatus, setSupportStatus] = useState(null);

  // Testimonials carousel
  const testimonials = [
    { id: 1, quote: "FurLuv helped me find the perfect match for my labrador. Amazing!", name: "Ana P." },
    { id: 2, quote: "The pet community is so friendly — love the local groups.", name: "Mark R." },
    { id: 3, quote: "Posting my pup's photos here got us so many adopters interested.", name: "Liza C." },
  ];
  const [testIndex, setTestIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTestIndex(i => (i + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, [testimonials.length]);

  // Counters animation
  const countersRef = useRef(null);
  const [countersStarted, setCountersStarted] = useState(false);
  useEffect(() => {
    const el = countersRef.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setCountersStarted(true);
      });
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll spy for nav highlighting
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".landing-navbar .nav-link");
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`.landing-navbar .nav-link[href="#${id}"], .landing-navbar .nav-link[data-target="${id}"]`);
        if (link) {
          if (entry.isIntersecting) {
            navLinks.forEach(n => n.classList.remove("active"));
            link.classList.add("active");
          }
        }
      });
    }, { threshold: 0.45 });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setSupportStatus({ ok: true, msg: "Support request sent — we'll reply to your email soon." });
    setSupportForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <LandingNavbar />

      <main className="landing-container">
        {/* HERO SECTION */}
        <section id="hero" className="landing-hero">
          <div className="landing-left">
            <img
              src="/assets/landing.png"
              alt="dog and cat"
              className="landing-img animate-float"
            />
          </div>

          <div className="landing-right fade-in">
            <h1 className="landing-title">Welcome to FurLuv</h1>
            <p className="landing-text">
              A modern pet community where you can connect, share updates, list pets,
              and safely find trusted matches. Join local clubs, post photos, and
              discover responsible breeders and adopters nearby.
            </p>

            <div className="landing-buttons">
              <Link to="/login" className="btn-login btn-anim">LOGIN</Link>
              <Link to="/register" className="btn-create btn-anim">CREATE ACCOUNT</Link>
            </div>

            {/* Quick mini features row */}
            <div className="mini-features fade-in-delay">
              <div className="mini">
                <strong>📸</strong>
                <span>Pet Profiles</span>
              </div>
              <div className="mini">
                <strong>🔎</strong>
                <span>Verified Matches</span>
              </div>
              <div className="mini">
                <strong>🧑‍🤝‍🧑</strong>
                <span>Local Clubs</span>
              </div>
            </div>
          </div>
        </section>

        {/* SVG wave divider */}
        <div className="wave-divider" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C200,0 400,80 720,40 C1040,0 1240,80 1440,40 L1440 80 L0 80 Z" fill="url(#g1)"></path>
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0" stopColor="#fbfbff" />
                <stop offset="1" stopColor="#ffffff" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ABOUT SECTION */}
        <section id="about" className="about-section fade-in-delay">
          <div className="about-inner">
            <div className="about-left">
              <h2>About FurLuv</h2>
              <p className="lead">
                FurLuv helps pet owners connect, share, and find responsible matches.
                Our platform makes it simple to create pet profiles, post beautiful photos,
                join local clubs, and discover trusted breeders or adopters in your area.
              </p>

              <div className="expanded-features">
                <article className="feature-large reveal-up">
                  <div className="feature-media">🐾</div>
                  <div className="feature-body">
                    <h4>Profile-rich pet pages</h4>
                    <p>Add multiple photos, health records, traits, and story snippets for each pet.</p>
                  </div>
                </article>

                <article className="feature-large reveal-up delay-1">
                  <div className="feature-media">🔒</div>
                  <div className="feature-body">
                    <h4>Verified Listings</h4>
                    <p>We offer tools for verification and reporting to keep the community safe.</p>
                  </div>
                </article>

                <article className="feature-large reveal-up delay-2">
                  <div className="feature-media">⚙️</div>
                  <div className="feature-body">
                    <h4>Breeding & Adoption Tools</h4>
                    <p>Responsible matchmaking workflows and in-app messaging for trust & clarity.</p>
                  </div>
                </article>
              </div>
            </div>

            <div className="about-right">
              <div className="highlight-card reveal-up">
                <h3>Trusted By Local Pet Owners</h3>
                <p>Thousands of owners and pets use FurLuv to find matches and share moments.</p>

                <div className="stats-row" ref={countersRef => countersRef}>
                  <div className="counter">
                    <strong>{countersStarted ? 12000 : 0}+</strong>
                    <span>Users</span>
                  </div>
                  <div className="counter">
                    <strong>{countersStarted ? 4900 : 0}+</strong>
                    <span>Matches</span>
                  </div>
                  <div className="counter">
                    <strong>{countersStarted ? 2000 : 0}+</strong>
                    <span>Pets Listed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="testimonials-section fade-in">
          <div className="testimonials-inner">
            <h2>What owners say</h2>
            <div className="testimonial-card reveal-up">
              <p className="quote">“{testimonials[testIndex].quote}”</p>
              <p className="who">— {testimonials[testIndex].name}</p>
              <div className="dots">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestIndex(i)}
                    className={`dot ${i === testIndex ? "active" : ""}`}
                    aria-label={`Show testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORT / CONTACT */}
        <section id="support" className="support-section fade-in">
          <div className="support-inner">
            <div className="support-left">
              <h2>Support</h2>
              <p>Need help? Send us a message and we'll get back to you within 24–48 hours.</p>

              <div className="faq">
                <h4>Quick FAQs</h4>
                <details>
                  <summary>How do I create a pet profile?</summary>
                  <p>Register, go to your Owner Profile and click "Add Pet". Add photos and details.</p>
                </details>

                <details>
                  <summary>Is matchmaking moderated?</summary>
                  <p>Yes — profiles and listings are reviewed to help keep the community safe.</p>
                </details>

                <details>
                  <summary>How do I report a listing?</summary>
                  <p>Open the listing and press "Report". Our team will investigate promptly.</p>
                </details>
              </div>
            </div>

            <div className="support-right">
              <form className="support-form" onSubmit={handleSupportSubmit}>
                <label>
                  Name
                  <input
                    value={supportForm.name}
                    onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    value={supportForm.email}
                    onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Message
                  <textarea
                    rows="5"
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                    required
                  />
                </label>

                <button type="submit" className="btn-primary">Send Support Request</button>

                {supportStatus && (
                  <p className={`support-status ${supportStatus.ok ? "ok" : "error"}`}>
                    {supportStatus.msg}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* RESOURCES / LINKS */}
        <section id="resources" className="resources-section fade-in">
          <div className="resources-inner">
            <h2>Resources</h2>
            <div className="resources-grid">
              <a className="resource-card reveal-up" href="/guides">
                <h4>Pet Care Guides</h4>
                <p>Nutrition, grooming, and behavior resources curated by vets.</p>
              </a>

              <a className="resource-card reveal-up delay-1" href="/safety">
                <h4>Safety & Moderation</h4>
                <p>How we keep the community safe and what to do when you spot a problem.</p>
              </a>

              <a className="resource-card reveal-up delay-2" href="/events">
                <h4>Local Events</h4>
                <p>Find meetups and adoption drives near you.</p>
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
