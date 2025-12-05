import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const userData = await login(formData.email, formData.password);

      if (!userData || !userData.role) {
        setErrorMsg('Invalid email or password');
        return;
      }

      const role = userData.role.toLowerCase();

      navigate(
        role === 'deliverer' ? '/deliverer-dashboard' : '/purchaser-dashboard'
      );
    } catch (err) {
      console.error('Login failed:', err);
      setErrorMsg('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h2>

        {errorMsg && (
          <p className="text-red-400 text-sm mb-3 text-center">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brandBlue text-white font-semibold py-2 rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/register" className="text-brandBlue hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
