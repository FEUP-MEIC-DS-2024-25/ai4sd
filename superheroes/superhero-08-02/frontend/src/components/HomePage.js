import React, { useEffect, useState } from "react";
import apiClient from "../config/axios";
import "../styles/HomePage.css";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await apiClient.post("/logout/");
      alert("You have been logged out");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/");
        const { isAuthenticated, username, projects } = response.data;
        setIsAuthenticated(isAuthenticated);
        setUsername(username);
        setProjects(projects);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="home-page">
      <main className="main-content">
        {isAuthenticated ? (
          <div className="user-info">
            <p className="welcome-message">Hello, {username}! You are logged in.</p>
            <p className="projects-title">Your SPARK projects:</p>

            <ul className="project-list">
              {sparkProjects.map((project) => (
                <li key={project.id} className="project-item">
                  <a href={`/spark-project/${project.id}`} className="project-link">
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>

            <a href="/spark/create/" className="logout-button">
              Create a new SPARK project
            </a>

            <button onClick={handleLogout} className="logout-button">Log out</button>
          </div>
        ) : (
          <div className="guest-info">
            <p className="not-logged-message">You are not logged in.</p>
            <p className="login-prompt">
              <a href="/login" className="login-link">Log in </a> or 
              <a href="/signup" className="signup-link"> Sign up</a> to create an account.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
