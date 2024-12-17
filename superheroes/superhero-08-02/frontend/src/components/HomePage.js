import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [sparkProjects, setSparkProjects] = useState([]);

  // Fetch user and project data from Django backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/home/") // Replace with your actual API endpoint
      .then((response) => {
        const { user, projects } = response.data;
        setIsAuthenticated(user.is_authenticated);
        setUsername(user.username);
        setSparkProjects(projects);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      {/* Header Component */}
      <Header />

      <main>
        {isAuthenticated ? (
          <div>
            <p>Hello, {username}! You are logged in.</p>
            <p>Your SPARK projects:</p>

            <ul>
              {sparkProjects.map((project) => (
                <li key={project.id}>
                  <a href={`/spark_project/${project.id}`}>{project.name}</a>
                </li>
              ))}
            </ul>

            <a href="/create_spark_project">Create a new SPARK project</a>

            <form method="POST" action="/logout">
              <button type="submit">Logout</button>
            </form>
          </div>
        ) : (
          <div>
            <p>You are not logged in.</p>
            <p>
              <a href="/login">Log in</a> or <a href="/signup">Sign up</a> to create an account.
            </p>
          </div>
        )}
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default HomePage;
