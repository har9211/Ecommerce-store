import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Load saved user on first render, so a page refresh doesn't log you out.
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("user", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("user", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const updateProfile = async (details) => {
    const res = await api.put("/auth/me", details);
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("user", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  const setSession = (data) => {
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    updateProfile,
    setSession,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
