import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
      if (data.resetToken) navigate(`/reset-password?token=${encodeURIComponent(data.resetToken)}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not start password reset.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="container auth-page page-enter"><form className="auth-card" onSubmit={submit}><h2>Reset your password</h2><p className="auth-subtitle">Enter your account email to continue.</p>{error && <div className="auth-error">{error}</div>}{message && <div className="account-success">{message}</div>}<label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} autoCapitalize="none" autoCorrect="off" spellCheck="false" required /></label><button className="auth-submit" disabled={loading}>{loading ? "Checking..." : "Continue"}</button><p className="auth-switch"><Link to="/login">Back to login</Link></p></form></div>;
}
