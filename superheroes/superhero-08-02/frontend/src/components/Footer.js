import React from "react";
import "../styles/Footer.css"; // Import the Footer CSS

function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; 2024 SPARK.{" "}
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" className="footer-link">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" className="footer-link">
          Terms of Service
        </a>{" "}
        |{" "}
        <a href="https://www.youtube.com/watch?v=PgzkqqhQGUg&list=RDMM&start_radio=1&rv=dQw4w9WgXcQ&ab_channel=WTF" className="footer-link">
          Contact Us
        </a>
      </p>
    </footer>
  );
}

export default Footer;
