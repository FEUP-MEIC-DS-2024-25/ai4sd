import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../../config/axios";
import "../../styles/Project.css";

function Project() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [newMember, setNewMember] = useState("");
  const [errors, setErrors] = useState("");

  // Fetch project details
  useEffect(() => {
    apiClient
      .get(`spark/${projectId}/`)
      .then((response) => setProject(response.data))
      .catch((error) => console.error("Error fetching project:", error));
  }, [projectId]);

  // Handle adding new member
  const handleAddMember = (e) => {
    e.preventDefault();
    apiClient
      .post(`spark/${projectId}/add-member/`, {
        username: newMember,
      })
      .then(() => {
        setNewMember("");
        setErrors("");
        alert("Member added successfully!");
        window.location.reload(); // Refresh the page
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data.username || "Error adding member.");
        }
      });
  };

  // Handle project deletion
  const handleDeleteProject = (e) => {
    e.preventDefault();
    apiClient
      .post(`spark/${projectId}/delete/`)
      .then(() => {
        alert("Project deleted successfully!");
        navigate("/");
      })
      .catch((error) => console.error("Error deleting project:", error));
  };

  if (!project) {
    return <p className="loading-message">Loading project...</p>;
  }

  return (
    <div className="project-container">
      <h1 className="project-title">{project.name}</h1>
      <p className="project-description">
        <strong>Description:</strong> {project.description || "No description available."}
      </p>

      <div className="project-links">
        <p>
          <strong>GitHub Link:</strong>{" "}
          <a
            href={project.github_project_link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            {project.github_project_link}
          </a>
        </p>

        {project.miro_board_id && (
          <p>
            <strong>Miro Board:</strong>{" "}
            <a
              href={project.miro_board_link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              {project.miro_board_id}
            </a>
          </p>
        )}
      </div>

      <div className="action-buttons">
        <button className="btn-action">Load Product</button>
        <button className="btn-action">Generate Sprints</button>
        <button className="btn-action">Import Backlog</button>
      </div>

      <h2 className="members-title">Members</h2>
      <ul className="members-list">
        {project.members.map((member) => (
          <li key={member} className="member-item">
            <Link to={`/profile/${member}`} className="member-link">
              {member}
            </Link>
          </li>
        ))}
      </ul>

      <div className="add-member-section">
        <h2 className="add-member-title">Add Member</h2>
        {errors && <p className="error-message">{errors}</p>}

        <form className="add-member-form" onSubmit={handleAddMember}>
          <input
            type="text"
            name="username"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Enter username"
            className="form-input"
            required
          />
          <button type="submit" className="btn-submit">Add Member</button>
        </form>
      </div>

      <div className="project-buttons">
        <Link to="/" className="btn-secondary">Back to Home</Link>

        <form className="delete-form" onSubmit={handleDeleteProject}>
          <button type="submit" className="btn-danger">Delete Project</button>
        </form>
      </div>
    </div>
  );
}

export default Project;
