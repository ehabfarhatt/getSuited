import React, { useState } from "react";
import "./SignUp.css";
import * as FaIcons from "react-icons/fa";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register");
      }
  
      const data = await response.json();
      console.log("User created:", data);
  
      // You can redirect here or store token in localStorage if login returns token
      window.location.href = "/"; // or use navigate('/') if using React Router
  
    } catch (err: any) {
      alert(err.message);
    }
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

        
      </div>
    </div>
  );
};

export default SignUp;
