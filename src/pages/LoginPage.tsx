import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Users, Calendar, Plus, GraduationCap, UserCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle Google OAuth callback
  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const errorParam = searchParams.get('error');

    if (errorParam === 'oauth_failed') {
      setError('Google authentication failed. Please try again.');
      return;
    }

    if (token && userParam && !isAuthenticated) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        login(userData, token);
        setSuccess(`Login successful! Welcome ${userData.isOrganizer ? 'Organizer' : 'User'}.`);
        
        // Clear URL parameters
        navigate('/login', { replace: true });
      } catch (err) {
        setError('Failed to process authentication data.');
      }
    }
  }, [searchParams, navigate, login, isAuthenticated]);

  // Removed traditional email/password login - Google OAuth only

  const handleCreateEvent = () => {
    try {
      navigate('/events');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleUpdateEvent = () => {
    try {
      navigate('/events/manage');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleViewEvents = () => {
    try {
      navigate('/events');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleLogout = () => {
    logout();
    setSuccess('');
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <Layout title="CollegeHub Login">
        <div className="py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="CollegeHub Login">
      <div className="py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl w-fit mx-auto mb-4">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">CollegeHub</h1>
              <p className="text-gray-300">Login to access your dashboard</p>
            </div>

            {/* Google OAuth Only Login */}
            {!isAuthenticated ? (
              <div className="space-y-6">
                {/* Google OAuth Button */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-200 flex items-center justify-center space-x-3"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Info Text */}
                <div className="text-center">
                  <p className="text-gray-300 text-sm">
                    Secure login with your Google account
                  </p>
                </div>
              </div>
            ) : (
              /* Dashboard after login */
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`p-4 rounded-2xl w-fit mx-auto mb-4 ${
                    user?.isOrganizer 
                      ? 'bg-gradient-to-br from-purple-600 to-purple-700' 
                      : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                  }`}>
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : user?.isOrganizer ? (
                      <UserCheck className="h-12 w-12 text-white" />
                    ) : (
                      <GraduationCap className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome, {user?.name}!
                  </h2>
                  <p className="text-gray-300 mb-2">
                    {user?.isOrganizer ? 'Club Organizer' : 'User'}
                  </p>
                  {user?.isOrganizer && user?.clubName && (
                    <p className="text-purple-300 text-sm">{user.clubName}</p>
                  )}
                  {!user?.isOrganizer && user?.userId && (
                    <p className="text-cyan-300 text-sm">ID: {user.userId}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {user?.isOrganizer ? (
                    /* Organizer Actions */
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCreateEvent();
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-2"
                        type="button"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Create New Event</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUpdateEvent();
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
                        type="button"
                      >
                        <Calendar className="h-5 w-5" />
                        <span>Manage Events</span>
                      </button>
                    </>
                  ) : (
                    /* User Actions */
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleViewEvents();
                      }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center space-x-2"
                      type="button"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>View Events</span>
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

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

            {/* Additional Options */}
            {!isAuthenticated && (
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Need help? <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Contact Support</a>
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Only Google OAuth authentication is supported
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;
