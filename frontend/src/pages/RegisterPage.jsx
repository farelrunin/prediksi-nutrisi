import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Apple } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { colors } from '../styles/colors';

const RegisterPage = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Redirect ke landing page setelah user state terupdate
  useEffect(() => {
    if (registrationSuccess && user) {
      navigate('/');
    }
  }, [user, registrationSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Password tidak cocok');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setRegistrationSuccess(true);
    } catch (error) {
      console.error('Register error:', error);
      alert(error.message || 'Registrasi gagal');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/bg-food.jpg')" }}>
      {/* Dark overlay to make text readable */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 w-full max-w-md px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Join Us!</h1>
          <p className="text-orange-200 text-sm font-medium drop-shadow">Create an account to track your nutrition risk.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-5 py-4 bg-[#13301f]/60 backdrop-blur-md text-white placeholder-green-200/70 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-5 py-4 bg-[#13301f]/60 backdrop-blur-md text-white placeholder-green-200/70 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-5 py-4 bg-[#13301f]/60 backdrop-blur-md text-white placeholder-green-200/70 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-5 py-4 bg-[#13301f]/60 backdrop-blur-md text-white placeholder-green-200/70 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c2e0c6] hover:bg-[#b0d2b4] text-[#13301f] py-4 rounded-full font-bold shadow-lg transition-all duration-200 disabled:opacity-70 mt-4"
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-slate-200 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-green-200 font-semibold underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;