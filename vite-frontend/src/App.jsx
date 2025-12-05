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

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
// --- DEFINITIVE CHECK ---
if (!stripeKey) {
  throw new Error(
    'CRITICAL ERROR: VITE_STRIPE_PUBLISHABLE_KEY is not defined. Your .env file may not be loaded correctly. Please ensure it is in the `vite-frontend` directory and your Vite server is restarted.'
  );
}

const stripePromise = loadStripe(stripeKey);


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
                  <PurchaserDashboardPage />
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
