import React, { useState } from 'react';
import axios from 'axios';
import '../assets/CSS/Login.css'; // Import the CSS file
import loginImg from '../assets/Login_img.png'
import user from '../assets/user_avtar.png'
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate("")

  const loginbtn = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });
    
    if (!email) {
      return setErrors({ email: "Email is required", password: "" });
    }
    if (!password) {
      return setErrors({ email: '', password: 'Password is required' });
    }

    try {
      const res = await axios.post("https://splitzee.onrender.com/login", {
        email,
        password
      }, {
        withCredentials: true
      });
      console.log("Login Successful!", res.data);
      // alert("Login successful!");
      navigate('/')
      setEmail("");
      setPassword("");
      setErrors({ email: '', password: '' });
    } catch (err) {
      console.log("Error:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div className="login-container">
      {/* Left side - Green curved background with phone */}
      <div className="left-section">
        {/* Curved shape */}
        <div className="curved-overlay">
          <svg viewBox="0 0 1000 1000">
            <path 
              d="M0,0 L1000,0 L1000,700 Q800,800 600,750 Q400,700 200,800 Q100,850 0,800 Z" 
              fill="rgba(255,255,255,0.1)" 
            />
          </svg>
        </div>
        
        
        {/* Simple image */}
        <div className="image-container">
          <img 
            src={loginImg}
            alt="Login illustration"
            className="login-image"
          />
        </div>
        
      </div>

      {/* Right side - Login form */}
      <div className="right-section">
        <div className="form-container">
          {/* Profile section */}
          <div className="profile-section">
            <div className="profile-avatar">
              <img src={user} alt="" />
            </div>
            <h1 className="welcome-title">WELCOME</h1>
          </div>

          {/* Login form */}
          <div>
            {/* Username field */}
            <div className="form-group">
              <div className="input-label">
                <svg className="input-icon emerald" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Username
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input emerald-border"
              />
              {errors.email && (
                <p className="error-message">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div className="form-group">
              <div className="input-label">
                <img src="" alt="" />
                Password
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>

            {/* Forgot password link */}
            <div className="forgot-password">
              <button
                type="button"
                className="forgot-password-link"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login button */}
            <div className="login-button-container">
              <button
                onClick={loginbtn}
                className="login-button"
              >
                LOGIN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
