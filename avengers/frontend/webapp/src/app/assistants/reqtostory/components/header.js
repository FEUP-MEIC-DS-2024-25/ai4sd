import React, { useState } from "react";  

const Header = () => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <header>
      <div>
          <span>AI Generator of User Stories</span>
      </div>
      <div>
        <h1>ReqToStory</h1>
      </div>
      <div>
        <button 
          type="button" 
          aria-label="Settings" 
          id="settingsButton"
          onClick={toggleSettings}  
        >
          <i className="fa fa-bars"></i>
        </button>
        <SettingsDropdown show={showSettings} /> 
      </div>
    </header>
  );
};

const SettingsDropdown = ({ show }) => {  
  return (
    <div className={`settings-dropdown ${show ? 'show' : ''}`} id="settingsDropdown">
      <h2>Settings</h2>
      <hr />
      <div className="settings-item">
        <h3>Priority</h3>
        <div className="settings-options">
          <label>
            <input type="radio" name="priority" value="high" />
            High
          </label>
          <label>
            <input type="radio" name="priority" value="medium" />
            Medium
          </label>
          <label>
            <input type="radio" name="priority" value="low" />
            Low
          </label>
        </div>
      </div>
      <div className="settings-item">
        <h3>Group By</h3>
        <div className="settings-options">
          <label>
            <input type="radio" name="groupBy" value="theme" />
            Group by Theme
          </label>
          <label>
            <input type="radio" name="groupBy" value="priority" />
            Group by Priority
          </label>
        </div>
      </div>
      <div className="settings-footer">
        <button className="settings-save-btn">Save Settings</button>
      </div>
    </div>
  );
};

export default Header;