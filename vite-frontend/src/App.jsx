import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PurchaserDashboardPage from './pages/PurchaserDashboardPage';
import DelivererDashboardPage from './pages/DelivererDashboardPage';

import ProtectedRoute from './router/ProtectedRoute';
import RoleRoute from './router/RoleRoute';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function App() {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Purchaser only */}
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

            {/* Deliverer only */}
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
      </Elements>
    </AuthProvider>
  );
}
