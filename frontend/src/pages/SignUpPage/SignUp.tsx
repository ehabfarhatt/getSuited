import React, { useState } from "react";
import "./SignUp.css";
import {
  FaFacebookF,
  FaApple,
  FaGoogle,
  FaTwitter,
  FaLock,
} from "react-icons/fa";

interface SignUpProps {
  onSignUp?: (name: string, email: string, password: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple example check
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // If onSignUp prop is provided, call it
    if (onSignUp) {
      onSignUp(name, email, password);
    }

    console.log("Sign up with:", name, email, password);
    // Clear fields or handle next steps
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create an Account</h2>
        <p className="sub-header">
          Already have an account? <a href="/signin">Sign in here</a>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={handleToggleShowPassword}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span onClick={handleToggleShowPassword}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        {/* Social Signup Buttons */}
        <div className="social-buttons">
          <button className="social-btn">
            <FaFacebookF />
          </button>
          <button className="social-btn">
            <FaApple />
          </button>
          <button className="social-btn">
            <FaGoogle />
          </button>
          <button className="social-btn">
            <FaTwitter />
          </button>
        </div>

        {/* SSO Signup */}
        <button className="sso-btn">
          <FaLock className="lock-icon" />
          Sign up with SSO
        </button>
      </div>
    </div>
  );
};

export default SignUp;
