import React from "react";

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <div id="languageSelector" className="relative min-w-[200px]">
      <select
        value={selectedLanguage}
        className="language-dropdown w-full p-2 bg-[rgba(47,47,47,0.5)] border border-[rgba(225,225,225,0.1)] rounded-lg text-[var(--header-text-color)] text-[0.95rem] cursor-pointer transition-all ease-in-out duration-300 appearance-none backdrop-blur-sm shadow-md hover:bg-[rgba(47,47,47,0.8)] hover:border-[rgba(225,225,225,0.3)] hover:transform hover:translate-y-[-1px] hover:shadow-lg focus:outline-none focus:border-[rgba(225,225,225,0.5)] focus:shadow-[0_0_0_2px_rgba(225,225,225,0.1)]"
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        <option value="en">English</option>
        <option value="pt">Português</option>
        <option value="es">Español</option>
      </select>
      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--header-text-color)] text-sm pointer-events-none">▼</span>
    </div>
  );
};

export default LanguageSelector;