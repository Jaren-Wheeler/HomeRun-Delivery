import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import CreateAccountPage from './pages/CreateAccount';
import PurchaserDashboardPage from './pages/PurchaserDashboard';
import DelivererDashboardPage from './pages/DelivererDashboard';
import ProtectedRoute from './router/ProtectedRoute';
import RoleRoute from './router/RoleRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />

        {/* Purchaser-only */}
        <Route
          path="/purchaser-dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="purchaser">
                <PurchaserDashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Deliverer-only */}
        <Route
          path="/deliverer-dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="deliverer">
                <DelivererDashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
