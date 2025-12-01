import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import PurchaserDashboard from './pages/PurchaserDashboard';
import DelivererDashboard from './pages/DelivererDashboard';
import Homepage from './pages/Homepage';
import Payment from './pages/Payment';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <div style={{minHeight: "100vh", backgroundColor: "#F3F4F6"}}>
        <NavBar />

        <Routes>
          <Route path="/deliverer-dashboard" element={<DelivererDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
