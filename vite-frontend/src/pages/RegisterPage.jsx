import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../api/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ⬅ Auto login after registration

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'purchaser',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (checked ? 'deliverer' : 'purchaser') : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      return setErrorMsg('Passwords do not match');
    }

    setLoading(true);

    try {
      // Step 1: Register (backend does NOT return token)
      await authService.register(formData);

      // Step 2: Login immediately to get token + user
      const userData = await login(formData.email, formData.password);

      // Redirect based on role
      navigate(
        userData.role === 'deliverer'
          ? '/deliverer-dashboard'
          : '/purchaser-dashboard'
      );
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Registration failed');
      console.error('❌ Register Error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create Account
        </h2>

        {errorMsg && (
          <p className="text-red-400 text-sm mb-3 text-center">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            required
            className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white"
            onChange={handleChange}
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            required
            className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white"
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            required
            className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white"
            onChange={handleChange}
          />

          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              name="role"
              checked={formData.role === 'deliverer'}
              onChange={handleChange}
            />
            I want to be a delivery driver
          </label>

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white"
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white"
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brandBlue text-white font-semibold py-2 rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?
          <Link to="/" className="text-brandBlue hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
