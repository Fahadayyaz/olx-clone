import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      // Store token temporarily and fetch user
      localStorage.setItem("zill_user", JSON.stringify({ token }));
      API.get("/auth/me")
        .then((res) => {
          login({ ...res.data, token });
          toast.success("Google login successful!");
          navigate("/");
        })
        .catch(() => {
          toast.error("Google login failed");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [params, login, navigate]);

  return <div className="spinner" />;
}
