import React, { useEffect, useState } from "react";
import apiClient from "../config/axios";
import { Link } from "react-router-dom";

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


  // Fetch user and project data from Django backend
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>

      <main>
        {isAuthenticated ? (
          <div>
            <p>Hello, {username}! You are logged in.</p>
            <p>Your SPARK projects:</p>

            <ul>
              {projects.map((project) => (
                <li key={project.id}>
                  <Link to={`/spark/${project.id}`}>{project.name}</Link>
                </li>
              ))}
            </ul>

            <Link to ="/spark/create">Create a new SPARK project</Link>

            <button onClick={handleLogout}>Log out</button>

«          </div>
        ) : (
          <div>
            <p>You are not logged in.</p>
            <p>
              <a href="/login">Log in</a> or <a href="/signup">Sign up</a> to create an account.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
