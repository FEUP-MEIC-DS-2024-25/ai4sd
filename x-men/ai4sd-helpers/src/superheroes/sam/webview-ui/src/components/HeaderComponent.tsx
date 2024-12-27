import { HeaderScreenProps } from "../utilities/types";

function HeaderComponent({backButton, backPage, numberIssues} : HeaderScreenProps): React.JSX.Element {
  return(
    <div style={{ position: "relative" }}>
      {backButton && backPage && <div
        onClick={() => backButton(backPage)}
        style={{
          position: "absolute", 
          top: "-18px", 
          left: "-2px", 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px", 
          height: "32px", 
          cursor: "pointer",
          opacity: "0.4",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "20px", 
            height: "20px",
          }}
        >
          <line x1="0" y1="10" x2="20" y2="10" />
          <polyline points="6 4 0 10 6 16" />
        </svg>
      </div>}
  
      <h2 style={{ textAlign: "center", opacity: "0.85" }}>SAM</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid rgba(255, 255, 255, 0.5)",
          paddingBottom: "10px",
          opacity: "0.8",
          fontSize: "13px", 
          fontWeight: "bold"
        }}
      >
        <span>Your issues</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 21 21"
            style={{
              marginRight: "7px",
              verticalAlign: "5px",
              width: "16px",
              height: "16px",
              flexShrink: 0,
            }}
          >
            <circle
              cx="10"
              cy="10"
              r="9"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            />
            <circle cx="10" cy="10" r="2" fill="currentColor" />
          </svg>
          {numberIssues} Open
        </span>
      </div>
    </div>
  )
}
export default HeaderComponent

