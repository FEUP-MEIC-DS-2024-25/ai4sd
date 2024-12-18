import React, { useState } from "react";  

const Header = () => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <header className="bg-[#171717] text-[#e1e1e1] shadow-[0_0_20px_rgba(0,0,0,0.7)] text-center p-8 mx-auto my-8 flex flex-col items-center gap-6  w-[90%]">
        <h1 className="text-[2em]">ReqToStory</h1>
        <h2>AI Generator of User Stories</h2>
    </header>
  );
};


export default Header;