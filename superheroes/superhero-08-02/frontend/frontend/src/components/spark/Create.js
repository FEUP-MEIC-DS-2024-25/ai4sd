import React, { useState } from "react";
import axios from "axios";

function Create() {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/projects/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSuccessMessage("Project created successfully!");
      setFormData({
        projectName: "",
        description: "",
      });
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error("Error creating project:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Spark Project</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}

      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className={`form-control ${errors.projectName ? "is-invalid" : ""}`}
            required
          />
          {errors.projectName && <div className="invalid-feedback">{errors.projectName}</div>}
        </div>

        <div className="form-group mt-3">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            required
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Create Project
        </button>
      </form>
    </div>
  );
}

export default Create;