import React, { useState } from 'react';
import Layout from '../components/Layout';
import { UserCheck, Mail, Lock, Eye, EyeOff, Loader2, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function OrganizerLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    clubName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // MongoDB authentication
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          clubName: formData.clubName
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Login successful! You are now authorized.');
        setIsLoggedIn(true);
        console.log('Authentication successful with MongoDB:', data.organizer);
      } else {
        setError(data.message || 'Invalid email or password. Please check your credentials.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      console.error('Authentication error:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  const handleUpdateEvent = () => {
    navigate('/events/manage');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSuccess('');
    setFormData({ email: '', password: '', clubName: '' });
  };


  return (
    <Layout title="Club Organizer Portal">
      <div className="py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="p-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl w-fit mx-auto mb-4">
                <UserCheck className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Club Organizer</h1>
              <p className="text-gray-300">Access your club management dashboard</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Club Name</label>
                <input
                  type="text"
                  value={formData.clubName}
                  onChange={(e) => setFormData({...formData, clubName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                  placeholder="Enter your club name"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                    placeholder="organizer@college.edu"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </div>
                ) : (
                  'Access Organizer Dashboard'
                )}
              </button>
            </form>

            {/* Status Messages */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                <p className="text-green-400 text-sm text-center">{success}</p>
              </div>
            )}

            {/* Event Management Buttons - Only shown after successful login */}
            {isLoggedIn && (
              <div className="mt-6 space-y-3">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Event Management</h3>
                  <p className="text-sm text-gray-300">You can now manage your club events</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleCreateEvent}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create New Event</span>
                  </button>
                  
                  <button
                    onClick={handleUpdateEvent}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Manage Existing Events</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Additional Options */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Need help? <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrganizerLoginPage;