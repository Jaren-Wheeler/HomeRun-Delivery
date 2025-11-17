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
      <NavBar></NavBar>

      <Routes>
        {/*<Route path="/" element={<Homepage />} />*/}
         {/*<Route path="/purchaser-dashboard" element={<PurchaserDashboard />} />*/}
        <Route path="/deliverer-dashboard" element={<DelivererDashboard />} />
         {/*<Route path="/payment" element={<Payment />} />*/}
      </Routes>
    </Router>
  );
}

export default App;
