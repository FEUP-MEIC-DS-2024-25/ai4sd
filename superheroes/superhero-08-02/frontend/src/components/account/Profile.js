import React, { useState, useEffect } from "react";
import apiClient from "../../config/axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import "../../styles/Profile.css";

function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [miroToken, setMiroToken] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const profileEndpoint = username
    ? `/profile/${username}/`
    : "/profile/";

  // Fetch user profile data
  useEffect(() => {
    apiClient
      .get(profileEndpoint)
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, [profileEndpoint]);

  const handleMiroTokenSubmit = (e) => {
    e.preventDefault();
    apiClient
      .post("/api/add-miro-token/", { miro_token: miroToken })
      .then((response) => {
        alert("Miro token saved successfully!");
        setUser((prevUser) => ({
          ...prevUser,
          profile: {
            ...prevUser.profile,
            miro_token: miroToken,
          },
        }));
        setMiroToken("");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors("Error saving Miro token.");
        }
      });
  };

  // Handle Unlink Actions
  const handleAction = (url, message) => {
    apiClient
      .post(url)
      .then((response) => {
        alert(message);

        if (url.includes("github-unlink")) {
          setUser((prevUser) => ({
            ...prevUser,
            profile: { ...prevUser.profile, github_username: null },
          }));
        } else if (url.includes("delete-miro-token")) {
          setUser((prevUser) => ({
            ...prevUser,
            profile: { ...prevUser.profile, miro_token: null },
          }));
        }
      })
      .catch((error) => console.error(`Error performing action on ${url}:`, error));
  };

  if (errors) {
    return <p>{errors}</p>;
  }

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
