import React, { useState } from "react";
import "./SignIn.css";

// Optional: React Icons for social & SSO icons
import { FaFacebookF, FaApple, FaGoogle, FaTwitter, FaLock } from "react-icons/fa";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in with:", email, password);
    if (onSignIn) {
      onSignIn(email, password);
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

        {/* Social Login Buttons */}
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

        {/* SSO Login Button */}
        <button className="sso-btn">
          <FaLock className="lock-icon" />
          Log in with SSO
        </button>
      </div>
    </div>
  );
};

export default SignIn;
