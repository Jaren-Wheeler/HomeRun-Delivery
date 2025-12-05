import { Navigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

export default function RoleRoute({ role, children }) {
  const { user } = useAuth();
  if (!user || user.role !== role) return <Navigate to="/" replace />;
  return children;
}
