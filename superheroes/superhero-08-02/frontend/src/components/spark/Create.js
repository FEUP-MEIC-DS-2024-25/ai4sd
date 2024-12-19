import React, { useState } from "react";
import apiClient from "../../config/axios";
import { useNavigate } from "react-router-dom";
import "./Create.css"; // Import the Create CSS

function Create() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    github_project_link: "",
    miro_board_id: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors("");

    setIsLoading(true);

    apiClient.post("/spark/create/", formData)
    .then((response) => {
      alert(response.data.message);
      const projectID = response.data.project_id;
      navigate(`/spark/${projectID}`);
    })
    .catch((error) => {
      console.error("Error creating project: ", error);
      if (error.response?.data?.error) {
        setErrors(error.response.data.error);
      } else {
        setErrors("An unexpected error occurred. Please try again.");
      }
    })
    .finally(() => { setIsLoading(false); });
  };

  return (
    <div className="create-container">
      <h2 className="create-title">Create Spark Project</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? "is-invalid" : ""}`}
            required
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-input ${errors.description ? "is-invalid" : ""}`}
            required
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="githubLink">GitHub Project Link</label>
          <input
            type="text"
            id="github_project_link"
            name="github_project_link"
            value={formData.github_project_link}
            onChange={handleChange}
            className={`form-input ${errors.githubLink ? "is-invalid" : ""}`}
            required
          />
          {errors.githubLink && (
            <div className="invalid-feedback">{errors.githubLink}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="miroBoard">Miro Board ID</label>
          <input
            type="text"
            id="miro_board_id"
            name="miro_board_id"
            value={formData.miro_board_id}
            onChange={handleChange}
            className={`form-input ${errors.miroBoard ? "is-invalid" : ""}`}
            required
          />
          {errors.miroBoard && (
            <div className="invalid-feedback">{errors.miroBoard}</div>
          )}
        </div>

        <button type="submit" className="create-button" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}

export default Create;
