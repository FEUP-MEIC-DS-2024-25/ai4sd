import * as React from "react";

import { cn } from "@/app/lib/utils";

const CaveInput = React.forwardRef(({ className, type, suggestions = [], onAutocomplete, ...props }, ref) => {
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (suggestions.length > 0) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }

    if (onAutocomplete) {
      onAutocomplete(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);
    if (onAutocomplete) {
      onAutocomplete(suggestion);
    }
  };

  return (
    <div className="autocomplete-wrapper" style={{ position: "relative" }}>
      <input
        type={type}
        value={inputValue}
        onChange={handleChange}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      {filteredSuggestions.length > 0 && (
        <ul
          className="autocomplete-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            zIndex: 1000,
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="autocomplete-item"
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

CaveInput.displayName = "CaveInput";

export default CaveInput;