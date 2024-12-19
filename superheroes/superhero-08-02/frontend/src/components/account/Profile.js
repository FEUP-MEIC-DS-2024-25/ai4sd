import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [miroToken, setMiroToken] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/profile/")
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  // Handle Miro Token Submission
  const handleMiroTokenSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/add-miro-token/", { miro_token: miroToken })
      .then(() => {
        alert("Miro token saved successfully!");
        window.location.reload(); // Reload profile data
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors("Error saving Miro token.");
        }
      });
  };

  // Handle Unlink Actions
  const handleAction = (url, message) => {
    axios
      .post(url)
      .then(() => {
        alert(message);
        window.location.reload(); // Reload profile data
      })
      .catch((error) => console.error(`Error performing action on ${url}:`, error));
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">User Profile</h1>

      {/* Back to Home Link */}
      <p>
        <Link to="/" className="btn btn-secondary">Go back to Home Page</Link>
      </p>

      {/* User Information */}
      <h2>User Information</h2>
      <ul className="list-group mb-4">
        <li className="list-group-item">Username: {user.username}</li>

        <li className="list-group-item">
          Github Username:{" "}
          {user.profile.github_username ? (
            <>
              <a
                href={`https://github.com/${user.profile.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.profile.github_username}
              </a>
              {user.is_current_user && (
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() =>
                    handleAction(
                      "http://localhost:8000/api/github-unlink/",
                      "GitHub account unlinked successfully!"
                    )
                  }
                >
                  Unlink
                </button>
              )}
            </>
          ) : (
            "Not associated"
          )}
        </li>

        <li className="list-group-item">
          Miro Token:{" "}
          {user.profile.miro_token ? (
            <>
              <span>Token is associated</span>
              {user.is_current_user && (
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() =>
                    handleAction(
                      "http://localhost:8000/api/delete-miro-token/",
                      "Miro token deleted successfully!"
                    )
                  }
                >
                  Delete Miro Token
                </button>
              )}
            </>
          ) : (
            <>
              Not associated
              {user.is_current_user && (
                <form onSubmit={handleMiroTokenSubmit} className="mt-3">
                  <input
                    type="text"
                    id="miro_token"
                    name="miro_token"
                    value={miroToken}
                    onChange={(e) => setMiroToken(e.target.value)}
                    className="form-control mb-2"
                    placeholder="Enter your Miro token"
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Save Miro Token
                  </button>
                </form>
              )}
            </>
          )}
        </li>
      </ul>

      {/* Associate Github Button */}
      {user.is_current_user && (
        <a href="http://localhost:8000/api/github-login/" className="btn btn-primary">
          Associate Github Account
        </a>
      )}
    </div>
  );
}

export default Profile;
