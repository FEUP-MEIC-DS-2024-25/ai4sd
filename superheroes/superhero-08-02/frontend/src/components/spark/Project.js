import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../../config/axios";

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
    return <p>Loading project...</p>;
  }

  return (
    <div className="container mt-4">
      <h1>{project.name}</h1>
      <p>
        <strong>Description:</strong> {project.description || "No description available."}
      </p>

      <div className="mt-3">

        <p>
          <strong>GitHub Link:</strong>{" "}
          <Link to={project.github_project_link} target="_blank" rel="noopener noreferrer">
            {project.github_project_link}
          </Link>
        </p>

        {project.miro_board_id && (
          <p>
            <strong>Miro Board:</strong>{" "}
            <Link to={project.miro_board_link} target="_blank" rel="noopener noreferrer">
              {project.miro_board_id}
            </Link>
          </p>
        )}
      </div>

      <h2 className="mt-4">Members</h2>
      <ul>
        {project.members.map((member) => (
          <li key={member}>
            <Link to={`/profile/${member}`}>{member}</Link>
          </li>
        ))}
      </ul>

      <div className="container mt-4">
        <h2>Add Member</h2>
        {errors && <p className="error-message">{errors}</p>}

        <form className="mt-3" onSubmit={handleAddMember}>
          <input
            type="text"
            name="username"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Enter username"
            className="form-control mb-2"
            required
          />
          <button type="submit" className="btn btn-primary">
            Add Member
          </button>
        </form>
      </div>

      <div className="mt-4">
        <Link to="/" className="btn btn-secondary">
          Back to Home
        </Link>

        <form className="d-inline" onSubmit={handleDeleteProject}>
          <button type="submit" className="btn btn-danger">
            Delete Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default Project;