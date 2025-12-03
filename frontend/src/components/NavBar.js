import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem"}}>
      <Link to="/purchaser-dashboard">Purchaser Dashboard</Link>
      <Link to="/deliverer-dashboard">Deliverer Dashboard</Link>
      <Link to="/payment">Payment</Link>
    </nav>
  );
}

export default NavBar;