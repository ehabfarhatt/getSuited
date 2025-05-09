// File: frontend/src/pages/OAuthSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      fetch("http://localhost:5001/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.decoded) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(data.decoded));
            navigate("/");
          } else {
            navigate("/signin");
          }
        })
        .catch(() => navigate("/signin"));
    } else {
      navigate("/signin");
    }
  }, []);

  return <p>Redirecting...</p>;
};

export default OAuthSuccess;