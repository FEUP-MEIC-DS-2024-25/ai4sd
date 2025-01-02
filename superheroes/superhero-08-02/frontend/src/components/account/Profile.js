import React, { useState, useEffect } from "react";
import apiClient from "../../config/axios";
import { Link, useParams } from "react-router-dom";
import "../../styles/Profile.css";

function Profile() {
  const { username } = useParams();
  const [miroTokenInput, setMiroTokenInput] = useState("");
  const [user, setUser] = useState({
    username: "",
    is_own_profile: null,
    github_username: "",
    miro_token: false,
  });

  const [errors, setErrors] = useState("");

  const profileEndpoint = username ? `/profile/${username}/` : "/profile/";

  // Fetch user profile data
  useEffect(() => {
    apiClient
      .get(profileEndpoint)
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, [profileEndpoint]);

  const handleGitHubLink = async () => {
    try {
      const response = await apiClient.get("/github/login/");
      const { auth_url } = response.data;
      window.location.href = auth_url;
    } catch (error) {
      console.error("Error fetching GitHub auth URL:", error);
      alert("Error fetching GitHub auth URL.");
    }
  };

  const handleGitHubUnlink = async () => {
    try {
      await apiClient.post("/github/unlink/");
      alert("GitHub account unlinked successfully!");
      setUser((prevUser) => ({
        ...prevUser,
        github_username: null,
      }));
    } catch (error) {
      console.error("Error unlinking GitHub account:", error);
      alert("Error unlinking GitHub account.");
    }
  };

  const handleMiroTokenSubmit = (e) => {
    e.preventDefault();
    apiClient
      .post("/miro/add-token/", { miro_token: miroTokenInput })
      .then(() => {
        alert("Miro token saved successfully!");
        setUser((prevUser) => ({
          ...prevUser,
          miro_token: true,
        }));
        setMiroTokenInput("");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors("Error saving Miro token.");
        }
      });
  };

  const handleMiroTokenDelete = async () => {
    try {
      await apiClient.post("miro/delete-token/");
      alert("Miro token deleted successfully!");
      setUser((prevUser) => ({
        ...prevUser,
        miro_token: null,
      }));
    } catch (error) {
      console.error("Error deleting Miro token:", error);
      alert("Error deleting Miro token.");
    }
  };

  if (errors) {
    return <p className="error-message">{errors}</p>;
  }

  if (!user) {
    return <p className="loading-message">Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>



      <h2 className="section-title">User Information</h2>
      <ul className="info-list">
        <li className="info-item">Username: {user.username}</li>

        <li className="info-item">
          Github Username:{" "}
          {user.github_username ? (
            <>
              <a
                href={`https://github.com/${user.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                {user.github_username}
              </a>
              {user.is_own_profile && (
                <button
                  className="btn-danger small-btn"
                  onClick={handleGitHubUnlink}
                >
                  Unlink
                </button>
              )}
            </>
          ) : (
            <>
              Not associated
              {user.is_own_profile && (
                <button
                  onClick={handleGitHubLink}
                  className="btn-primary small-btn"
                >
                  Associate Github Account
                </button>
              )}
            </>
          )}
        </li>

        <li className="info-item">
          Miro Token: {user.miro_token ? (
            <>
              <span className="token-status">Token is associated</span>
              {user.is_own_profile && (
                <button
                  className="btn-danger small-btn"
                  onClick={handleMiroTokenDelete}
                >
                  Delete Miro Token
                </button>
              )}
            </>
          ) : (
            <>
              Not associated
              {user.is_own_profile && (
                <form onSubmit={handleMiroTokenSubmit} className="token-form">
                  <input
                    type="text"
                    id="miro_token"
                    name="miro_token"
                    className="form-input"
                    placeholder="Enter your Miro token"
                    value={miroTokenInput}
                    onChange={(e) => setMiroTokenInput(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-submit">Save Miro Token</button>
                </form>
              )}
            </>
          )}
        </li>
      </ul>
      
      <p>
        <Link to="/" className="btn-secondary">Go back to Home Page</Link>
      </p>
    </div>
  );
}

export default Profile;
