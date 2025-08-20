import React, { useState } from 'react';
import axios from 'axios';
import '../assets/CSS/Login.css'; // Import the CSS file
import registerImg from '../assets/Login_img.png'
import user from '../assets/user_avtar.png'

function Register() {
  const [username,setName] =useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const registerbtn = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Clear previous errors
    setErrors({ email: "", password: "" });

    if (!email) {
      return setErrors({ email: "Email is required", password: "" });
    }
    if (!password) {
      return setErrors({ email: '', password: 'Password is required' });
    }
    if (!cpassword) {
      return setErrors({ email: '', password: 'Confirm password is required' });
    }

    // Password match check
    if (password !== cpassword) {
      return setErrors({ email: "", password: "Passwords do not match" });
    }

    try {
      const res = await axios.post("https://splitzee.onrender.com/register", {
        username,
        email,
        password
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      console.log("User registered:", res.data);
      alert("Registration Successful");

      // Reset all fields and errors
      setName("");
      setEmail("");
      setPassword("");
      setCPassword("");
      setErrors({ email: "", password: "" });
      setSubmitted(false);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div className="register-container">
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
            src={registerImg} 
            alt="Register illustration"
            className="register-image"
          />
        </div>
        
      </div>

      {/* Right side - Register form */}
      <div className="right-section">
        <div className="form-container">
          {/* Profile section */}
          <div className="profile-section">
            <div className="profile-avatar">
              <img src={user} alt="" />
            </div>
            <h1 className="welcome-title">REGISTER</h1>
          </div>

          {/* Register form */}
          <form onSubmit={registerbtn}>
          <div className="form-group">
              <div className="input-label">
                <svg className="input-icon gray" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z"/>
                </svg>
                Name
              </div>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            {/* Email field */}
            <div className="form-group">
              <div className="input-label">
                <svg className="input-icon emerald" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Email
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input emerald-border"
                required
              />
              {errors.email && (
                <p className="error-message">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div className="form-group">
              <div className="input-label">
                <svg className="input-icon gray" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z"/>
                </svg>
                Password
              </div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="form-group">
              <div className="input-label">
                <svg className="input-icon gray" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M9,19c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S10.1,19,9,19z M15,19c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S16.1,19,15,19z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z"/>
                </svg>
                Confirm Password
              </div>
              <input
                type="password"
                name="cpassword"
                value={cpassword}
                onChange={(e) => setCPassword(e.target.value)}
                className="form-input"
                required
              />
              {submitted && password !== cpassword && (
                <p className="error-message">Passwords do not match</p>
              )}
            </div>

            {/* Already have account link */}
            <div className="forgot-password">
              <button
                type="button"
                className="forgot-password-link"
              >
                Already have an account? Login
              </button>
            </div>

            {/* Register button */}
            <div className="register-button-container">
              <button
                type="submit"
                className="register-button"
              >
                REGISTER
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
