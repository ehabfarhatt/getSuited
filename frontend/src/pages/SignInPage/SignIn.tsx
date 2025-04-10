import React, { useState } from "react";
import "./SignIn.css";

import * as FaIcons from "react-icons/fa";

interface SignInProps {
  onSignIn?: (email: string, password: string) => void; 
  // Optional if you want to handle sign-in externally
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
  
      const { token, user } = await response.json();
      console.log("Login successful:", user);
  
      // Store token in localStorage or cookies
      localStorage.setItem("token", token);
  
      // Redirect to homepage or dashboard
      window.location.href = "/";
  
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2>Log in</h2>
        <p className="sub-header">
          New to Design Space? <a href="/signup">Sign up for free</a>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={handleToggleShowPassword}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <div className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-btn">
            Log in
          </button>
        </form>

      </div>
    </div>
  );
};

export default SignIn;
