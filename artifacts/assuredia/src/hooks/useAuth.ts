import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return { login, logout, isLoading };
}