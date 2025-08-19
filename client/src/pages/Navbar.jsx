import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../assets/CSS/Navbar.css';
import logo from '../assets/Login_img.png'

function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-user", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user); // store user info
      })
      .catch(() => {
        setUser(null); // not logged in
      });
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/logout", {}, { withCredentials: true })
      .then(() => {
        setUser(null);
        navigate("/login");
        setMobileMenuOpen(false); // Close mobile menu
      });
  };

  const toggleMobileMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Hamburger clicked!', !mobileMenuOpen); // Debug log
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        {/* Left side - Logo and brand */}
        <div className="navbar-left">
          <div className="logo-container">
            <div className="logo-image-placeholder">
              <img src={logo} alt="SplitZee" style={{width: "100%", height: "100%", objectFit: "contain"}} />
            </div>
          </div>
          
          <div className="brand-container">
            <Link to="/" className="brand-name">
              SplitZee
            </Link>
          </div>
        </div>

        {/* Right side - Desktop Navigation */}
        <div className="navbar-right">
          {/* Desktop Nav Links */}
          <div className="nav-links">
            <Link to="/groups" className="nav-link">
              Groups
            </Link>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div 
            className="hamburger-menu" 
            onClick={toggleMobileMenu}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleMobileMenu(e);
              }
            }}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>

          {/* User Info or Auth Links */}
          {user ? (
            <div className="user-info">
              <div className="user-avatar-container">
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : "V"}
                </div>
                <span className="username">
                  welcome {user.name}
                </span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">
                Login
              </Link>
              <Link to="/register" className="auth-link">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-links">
          <Link to="/groups" className="nav-link" onClick={closeMobileMenu}>
            Groups
          </Link>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>
            Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;