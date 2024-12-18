import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; // Import the Auth CSS

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
      const response = await axios.post("http://localhost:8000/login/", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.error || "Login failed.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Login</h1>

      {/* Display general form errors */}
      {errors && <div className="auth-error">{errors}</div>}

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
            className={`form-input ${formErrors.username ? "is-invalid" : ""}`}
            required
          />
          {formErrors.username && (
            <div className="form-feedback">{formErrors.username}</div>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
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
            className={`form-input ${formErrors.password ? "is-invalid" : ""}`}
            required
          />
          {formErrors.password && (
            <div className="form-feedback">{formErrors.password}</div>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="form-check">
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
        <button type="submit" className="auth-button">
          Login
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="auth-footer">
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
