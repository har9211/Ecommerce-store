import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./Auth.css";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (password !== confirmation) return setError("Passwords do not match.");
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", { token: params.get("token"), password });
      setSession(data);
      navigate("/account");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset your password.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="container auth-page page-enter"><form className="auth-card" onSubmit={submit}><h2>Choose a new password</h2><p className="auth-subtitle">Use at least 6 characters.</p>{error && <div className="auth-error">{error}</div>}<label>New password<input type="password" minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} required /></label><label>Confirm password<input type="password" minLength="6" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required /></label><button className="auth-submit" disabled={loading}>{loading ? "Saving..." : "Set new password"}</button><p className="auth-switch"><Link to="/login">Back to login</Link></p></form></div>;
}
