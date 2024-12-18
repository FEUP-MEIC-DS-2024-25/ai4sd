import React from "react";
import "./Footer.css"; // Import the Footer CSS

function Footer() {
  return (
    <footer>
      <p>
        &copy; 2024 SPARK.{" "}
        <a href="/privacy-policy">Privacy Policy</a> |{" "}
        <a href="/terms-of-service">Terms of Service</a> |{" "}
        <a href="/contact-us">Contact Us</a>
      </p>
    </footer>
  );
}

export default Footer;
