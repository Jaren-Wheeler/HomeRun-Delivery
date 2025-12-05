import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="flex gap-4">
        {/* Everyone sees Purchaser Dashboard */}
        <Link to="/purchaser-dashboard" className="hover:text-brandBlue">
          Purchaser
        </Link>

        {/* Deliverer-only option */}
        {user?.role === 'deliverer' && (
          <Link to="/deliverer-dashboard" className="hover:text-brandBlue">
            Deliverer
          </Link>
        )}
      </div>

      {/* Logout */}
      <button onClick={logout} className="text-red-400 hover:text-red-500">
        Logout
      </button>
    </nav>
  );
}
