import React, { useEffect, useState } from "react";
import apiClient from "../config/axios";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [sparkProjects, setSparkProjects] = useState([]);
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
        const { isAuthenticated, username, sparkProjects } = response.data;
        setIsAuthenticated(isAuthenticated);
        setUsername(username);
        setSparkProjects(sparkProjects);
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
              {sparkProjects.map((project) => (
                <li key={project.id}>
                  <a href={`/spark-project/${project.id}`}>{project.name}</a>
                </li>
              ))}
            </ul>

            <a href="/create-spark-project">Create a new SPARK project</a>

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
