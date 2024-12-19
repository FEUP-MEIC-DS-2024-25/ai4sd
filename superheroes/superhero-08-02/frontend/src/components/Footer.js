import React from "react";
import "../styles/Footer.css"; // Import the Footer CSS

function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; 2024 SPARK.{" "}
        <a href="/privacy-policy" className="footer-link">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a href="/terms-of-service" className="footer-link">
          Terms of Service
        </a>{" "}
        |{" "}
        <a href="/contact-us" className="footer-link">
          Contact Us
        </a>
      </p>
    </footer>
  );
}

export default Footer;
