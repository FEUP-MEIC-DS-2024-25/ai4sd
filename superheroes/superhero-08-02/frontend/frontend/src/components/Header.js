import React, { useState } from "react";

function Header() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev); // Toggle the menu visibility state
  };

  return (
    <div className="nav">
      <div className="together">
        {/* Logo */}
        <img src="/favicon.ico" alt="logo" height="50" style={{ width: "auto" }} />
        <h1 id="spark-title">SPARK</h1>
      </div>

      {/* Expandable Menu */}
      <div className="expand">
        <span className="expand-icon" onClick={toggleMenu}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/* Menu Links */}
        {menuVisible && (
          <div className="expandable-menu">
            <a href="/option1">Option 1</a>
            <a href="/option2">Option 2</a>
            <a href="/option3">Option 3</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
