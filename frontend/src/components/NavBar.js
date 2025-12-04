import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);

  // --- New Core Style Definitions ---
  const primaryBrandGreen = '#1e7145'; // Deep Forest Green (Header BG)
  const accentGreen = '#4cb64c';     // Vibrant Green (Accent)

  const navStyle = {
    backgroundColor: primaryBrandGreen,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '1rem 3rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  };

  const linkBaseStyle = {
    color: '#ffffff', // White text
    textDecoration: 'none',
    fontWeight: '500',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out, opacity 0.15s ease-in-out',
    opacity: 0.85, 
  };

  const getLinkStyles = (path) => {
    const isActive = location.pathname === path;

    const activeStyles = isActive ? {
      opacity: 1,
      fontWeight: '700',
      borderBottom: `2px solid ${accentGreen}`, // Vibrant green underline for active page
      paddingBottom: '0.5rem',
    } : {};

    const hoverStyles = (hoveredLink === path && !isActive) ? {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      opacity: 1,
    } : {};
    
    const logOutStyles = path === '/' ? {
      color: '#ffdddd',
    } : {};

    return {
      ...linkBaseStyle,
      ...logOutStyles,
      ...activeStyles,
      ...hoverStyles,
    };
  };

  return (
    <nav style={navStyle}>
      <Link 
        to="/" 
        style={getLinkStyles('/')}
        onMouseEnter={() => setHoveredLink('/')}
        onMouseLeave={() => setHoveredLink(null)}
      >
        Log out
      </Link>
      <Link 
        to="/purchaser-dashboard" 
        style={getLinkStyles('/purchaser-dashboard')}
        onMouseEnter={() => setHoveredLink('/purchaser-dashboard')}
        onMouseLeave={() => setHoveredLink(null)}
      >
        Purchaser Dashboard
      </Link>
      <Link 
        to="/deliverer-dashboard" 
        style={getLinkStyles('/deliverer-dashboard')}
        onMouseEnter={() => setHoveredLink('/deliverer-dashboard')}
        onMouseLeave={() => setHoveredLink(null)}
      >
        Deliverer Dashboard
      </Link>
      <Link 
        to="/payment" 
        style={getLinkStyles('/payment')}
        onMouseEnter={() => setHoveredLink('/payment')}
        onMouseLeave={() => setHoveredLink(null)}
      >
        Payment
      </Link>
    </nav>
  );
}

export default NavBar;