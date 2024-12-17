import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If login is successful
      if (response.data.success) {
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.non_field_errors || "Login failed.");
        setFormErrors(error.response.data);
      } else {
        console.error("Error during login:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Login</h1>

      {/* Display general form errors */}
      {errors && <div className="alert alert-danger">{errors}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        {/* Username Field */}
        <div className="form-group mb-3">
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
            className={`form-control ${formErrors.username ? "is-invalid" : ""}`}
            required
          />
          {formErrors.username && (
            <div className="invalid-feedback">{formErrors.username}</div>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
            required
          />
          {formErrors.password && (
            <div className="invalid-feedback">{formErrors.password}</div>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="remember">
            Remember Me
          </label>
        </div>

        {/* Login Button */}
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>

      {/* Sign Up Link */}
      <div className="mt-4 text-center">
        <p>
          <Link to="/signup">Don't have an account? Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
