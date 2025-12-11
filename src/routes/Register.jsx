import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { register } from "../utils/auth";
import "../styles/auth.css";
import AuthNavbar from "../components/AuthNavbar";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setLoading(false);
      return setError("Please fill all required fields.");
    }

    const res = await register(form);
    setLoading(false);
    
    if (!res.success) return setError(res.message);

    navigate("/login");
  };

  return (
    <>
      <AuthNavbar />
      <div className="auth-page">
        <div className="auth-card fade-up">
          <h2>Create Your Account</h2>
          {error && <div className="error">{error}</div>}

          <AuthForm onSubmit={handleSubmit}>
            {/* Remove username and petName fields, or keep them as optional client-side only */}
            <div className="row-2">
              <div className="input-group">
                <input name="firstName" value={form.firstName} onChange={handleChange} required />
                <label>First Name</label>
              </div>
              <div className="input-group">
                <input name="lastName" value={form.lastName} onChange={handleChange} required />
                <label>Last Name</label>
              </div>
            </div>

            <div className="input-group">
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
              <label>Email</label>
            </div>

            <div className="input-group password-group">
              <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required />
              <label>Password</label>
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="link-text" onClick={() => navigate("/login")}>
              Already have an account? Login
            </p>
          </AuthForm>
        </div>
      </div>
    </>
  );
}