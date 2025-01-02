"use client";


import React, { useState } from "react";
import apiClient from "../../config/axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Auth.css"; // Import the Auth CSS

function Signup() {
  const navigate = useNavigate();

  // State for form data and errors
  const [formData, setFormData] = useState({
    username: "",
    password1: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post("/signup/", formData);

      if (response.data.success) {
        alert("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error during signup:", error);
      }
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Sign Up</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            className={`form-input ${errors.username ? "is-invalid" : ""}`}
            required
          />
          {errors.username && (
            <div className="form-feedback">{errors.username}</div>
          )}
        </div>

        {/* Password Field 1 */}
        <div className="form-group">
          <label htmlFor="password1" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password1"
            name="password1"
            placeholder="Enter your password"
            value={formData.password1}
            onChange={handleChange}
            className={`form-input ${errors.password1 ? "is-invalid" : ""}`}
            required
          />
          {errors.password1 && (
            <div className="form-feedback">{errors.password1}</div>
          )}
        </div>

        {/* Password Field 2 */}
        <div className="form-group">
          <label htmlFor="password2" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="password2"
            name="password2"
            placeholder="Repeat the password"
            value={formData.password2}
            onChange={handleChange}
            className={`form-input ${errors.password2 ? "is-invalid" : ""}`}
            required
          />
          {errors.password2 && (
            <div className="form-feedback">{errors.password2}</div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="auth-button">
          Sign Up
        </button>
      </form>

      {/* Link to Login Page */}
      <div className="auth-footer">
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
