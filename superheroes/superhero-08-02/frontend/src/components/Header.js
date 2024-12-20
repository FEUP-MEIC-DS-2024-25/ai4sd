import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css"; 
import apiClient from "../config/axios";


function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is logged in
  const navigate = useNavigate();

  // Fetch user authentication status
  useEffect(() => {
    apiClient
      .get("/user-status/", { withCredentials: true })
      .then((response) => {
        console.log("Auth status response:", response.data);
        const { isAuthenticated } = response.data;
        setIsAuthenticated(isAuthenticated);
      })
      .catch((error) => console.error("Error checking authentication:", error));
  }, []);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev); // Toggle the menu visibility state
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/logout/", {}, { withCredentials: true });
      setIsAuthenticated(false); // Update authentication state
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <div className="nav">
      <div className="together" onClick={handleNavigateHome} style={{ cursor: "pointer" }}>
        {/* Logo */}
        <img src="/favicon.ico" alt="logo" height="50" style={{ width: "auto" }} />
        <h1 id="spark-title" className="sparkTitle">
          SPARK
        </h1>
      </div>

      {/* Expandable Menu */}
      <div className="expand">
        <span className="expandIcon expand-icon" onClick={toggleMenu}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <div className={`toggleMenu ${menuVisible ? "show" : ""}`}>
          {isAuthenticated ? (
            <>
              <Link to="/profile">Profile</Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
