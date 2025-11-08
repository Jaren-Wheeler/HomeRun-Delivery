import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import PurchaserDashboard from './pages/PurchaserDashboard';
import DelivererDashboard from './pages/DelivererDashboard';
import Homepage from './pages/Homepage';
import Payment from './pages/Payment';

function App() {
  return (
  
    <Router>
      <nav>
        <Link to="/">Home Page</Link>
        <Link to="/purchaser-dashboard">Purchaser Dashboard</Link>
        <Link to="/deliverer-dashboard">Deliverer Dashboard</Link>
        <Link to="/payment">Payment</Link>
      </nav>

      <Routes>
        <Route path="/deliverer-dashboard" element={<DelivererDashboard/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
