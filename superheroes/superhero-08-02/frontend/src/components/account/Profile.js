import React, { useState, useEffect } from "react";
import apiClient from "../../config/axios";
import { Link, useParams } from "react-router-dom";
import "./Profile.css";

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
      .then((response) => {
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
  }

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
          {user.github_username ? (
            <>
              <a
                href={`https://github.com/${user.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.github_username}
              </a>
              {user.is_own_profile && (
                <button className="btn btn-danger btn-sm ms-2" onClick={handleGitHubUnlink}>
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
          {user.miro_token ? (
            <>
              <span>Token is associated</span>
              {user.is_own_profile && (
                <button
                  className="btn btn-danger btn-sm ms-2"
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
                <form onSubmit={handleMiroTokenSubmit} className="mt-3">
                  <input
                    type="text"
                    id="miro_token"
                    name="miro_token"
                    className="form-control mb-2"
                    placeholder="Enter your Miro token"
                    value={miroTokenInput}
                    onChange={(e) => setMiroTokenInput(e.target.value)}
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
      {user.is_own_profile && (
        <button onClick={handleGitHubLink} className="btn btn-primary">
          Associate Github Account
        </button>
      )}
    </div>
  );
}

export default Profile;
