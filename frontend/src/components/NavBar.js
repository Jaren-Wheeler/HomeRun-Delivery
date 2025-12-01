import React from 'react';
import { Link } from 'react-router-dom';

const linkStyle = {
  color: "#333",
  textDecoration: "none",
  fontSize: "1.1rem",
  fontWeight: 500,
  padding: "0.5rem 0.75rem",
  borderRadius: "6px",
  transition: "0.2s ease-in-out",
};

const linkHoverStyle = {
  backgroundColor: "#f2f2f2",
};

function NavBar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
        padding: "1rem 2rem",
        backgroundColor: "#ffffff",
        width: "90%",
        margin: "0 auto 1.5rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <Link
        to="/"
        style={linkStyle}
        onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
      >
        Home Page
      </Link>

      <Link 
        style={linkStyle} 
        to="/purchaser-dashboard"
        onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
      >
        Purchaser Dashboard
      </Link>

      <Link 
        style={linkStyle} 
        to="/deliverer-dashboard"
        onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
      >
        Deliverer Dashboard
      </Link>

      <Link 
        style={linkStyle} 
        to="/payment"
        onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
      >
        Payment
      </Link>
    </nav>

  );
}

export default NavBar;