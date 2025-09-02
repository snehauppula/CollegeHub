import React from 'react';
import { 
  Calendar, 
  Users, 
  Mail, 
  Linkedin, 
  UserCheck, 
  GraduationCap,
  Sparkles,
  ArrowRight,
  Globe,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <GraduationCap className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">College Hub</h1>
              <p className="text-sm text-cyan-200">Events & Collaboration</p>
            </div>
          </div>
          
          {/* Login Buttons */}
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/organizer-login')}
              className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 border border-purple-500/30"
            >
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Log in as Club Organizer</span>
              </div>
            </button>
            <button 
              onClick={() => navigate('/student-login')}
              className="group px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/30"
            >
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Log in as Student</span>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 mb-6">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-200 font-medium">Next-Generation College Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Connect, Collaborate,
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Celebrate</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your ultimate hub for college events, club collaboration, and student networking. 
            Experience the future of campus engagement.
          </p>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Events Section Card */}
          <div className="group bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Explore Club Events</h2>
                <p className="text-cyan-200">Discover campus activities</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Stay updated with real-time events from all campus clubs. From academic workshops 
              to social gatherings, never miss what matters to you.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live data sync with Google Sheets</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Events data stored in Excel format</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Auto-refresh on application load</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/events')}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Discover Events</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>

          {/* Collaboration Section Card */}
          <div className="group bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Collaborate & Connect</h2>
                <p className="text-purple-200">Build your network</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Connect with fellow students, join collaborative projects, and expand your 
              professional network. Your college journey starts with meaningful connections.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Users className="h-4 w-4 text-purple-400" />
                <span>Student networking platform</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span>Cross-club collaboration tools</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Sparkles className="h-4 w-4 text-pink-400" />
                <span>Project matching system</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/collaboration')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Connect Now</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </div>

        {/* Alumni Network Section */}
        <section className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Alumni Network</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Connect with our accomplished alumni community. Get mentorship, career guidance, 
              and networking opportunities that last beyond graduation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gmail Integration */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-red-300/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-red-500 rounded-xl">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Email Directory</h3>
                  <p className="text-sm text-gray-300">Direct communication</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Access verified alumni email contacts for direct professional communication and mentorship requests.
              </p>
              <button 
                onClick={() => navigate('/alumni/email')}
                className="w-full bg-red-500 hover:bg-red-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300"
              >
                Browse Email Directory
              </button>
            </div>

            {/* LinkedIn Integration */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-300/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Linkedin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">LinkedIn Network</h3>
                  <p className="text-sm text-gray-300">Professional connections</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Explore alumni LinkedIn profiles, career paths, and professional achievements for career inspiration.
              </p>
              <button 
                onClick={() => navigate('/alumni/linkedin')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300"
              >
                Explore LinkedIn Network
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400">
            © 2025 College Hub. Empowering student connections and collaboration.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;