import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { login } from "../utils/auth";
import "../styles/auth.css";
import AuthNavbar from "../components/AuthNavbar";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    if (!form.email || !form.password) {
      setLoading(false);
      return setError("Please fill all fields.");
    }

    const res = await login(form);
    setLoading(false);
    
    if (!res.success) return setError(res.message);

    onLogin?.(res.user || { email: form.email });
    navigate("/dashboard");
  };

  return (
    <>
      <AuthNavbar />
      <div className="auth-page">
        <div className="auth-card fade-up">
          <h2>Welcome Back</h2>
          {error && <div className="error">{error}</div>}

          <AuthForm onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
              <label>Email</label>
            </div>

            <div className="input-group password-group">
              <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required />
              <label>Password</label>
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "" : ""}
              </span>
            </div>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </AuthForm>
        </div>
      </div>
    </>
  );
}