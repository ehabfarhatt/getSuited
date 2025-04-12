// src/pages/OAuthSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/"); // Redirect to home
    }
  }, []);

  return <p>Logging you in with Google...</p>;
};

export default OAuthSuccess;