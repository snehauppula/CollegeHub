import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Briefcase, 
  Search,
  Filter,
  ArrowRight,
  Linkedin,
  Plus,
  ExternalLink,
  User,
  GraduationCap,
  MapPin,
  Mail,
  Loader2
} from 'lucide-react';
import { 
  getNetworkingProfiles, 
  createNetworkingProfile, 
  getMyProfile,
  NetworkingProfile as ApiNetworkingProfile,
  CreateProfileData 
} from '../utils/networkingApi';


// Using the API interface from networkingApi.ts
type NetworkingProfile = ApiNetworkingProfile;

function CollaborationPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'networking'>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [profiles, setProfiles] = useState<NetworkingProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [newProfile, setNewProfile] = useState<Partial<CreateProfileData>>({
    name: '',
    major: '',
    year: '',
    skills: [],
    linkedinUrl: '',
    bio: '',
    interests: [],
    location: '',
    email: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  // Load networking profiles
  const loadProfiles = async () => {
    setLoading(true);
    try {
      const response = await getNetworkingProfiles();
      if (response.success && response.data) {
        setProfiles(response.data);
      }
    } catch (err) {
      console.error('Error loading profiles:', err);
      setError('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  // Check if current user has a profile
  const checkUserProfile = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await getMyProfile();
      if (response.success && response.data) {
        // User already has a profile, show different UI
        setError('You already have a networking profile. You can only create one profile per account.');
        return true;
      }
    } catch (err) {
      // User doesn't have a profile yet, which is fine
      console.log('User does not have a profile yet');
    }
    return false;
  };

  useEffect(() => {
    if (activeTab === 'networking') {
      loadProfiles();
      if (isAuthenticated) {
        checkUserProfile();
      }
    }
  }, [activeTab, isAuthenticated]);


  const getSkillColor = (skill: string) => {
    const colors = [
      'bg-blue-500/20 text-blue-400',
      'bg-green-500/20 text-green-400',
      'bg-purple-500/20 text-purple-400',
      'bg-orange-500/20 text-orange-400',
      'bg-pink-500/20 text-pink-400',
      'bg-cyan-500/20 text-cyan-400'
    ];
    const index = skill.length % colors.length;
    return colors[index];
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSkill = !skillFilter || profile.skills.some(skill => 
      skill.toLowerCase().includes(skillFilter.toLowerCase())
    );
    return matchesSearch && matchesSkill;
  });

  const handleAddSkill = () => {
    if (newSkill.trim() && newProfile.skills && !newProfile.skills.includes(newSkill.trim())) {
      setNewProfile({
        ...newProfile,
        skills: [...newProfile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (newProfile.skills) {
      setNewProfile({
        ...newProfile,
        skills: newProfile.skills.filter(skill => skill !== skillToRemove)
      });
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && newProfile.interests && !newProfile.interests.includes(newInterest.trim())) {
      setNewProfile({
        ...newProfile,
        interests: [...newProfile.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    if (newProfile.interests) {
      setNewProfile({
        ...newProfile,
        interests: newProfile.interests.filter(interest => interest !== interestToRemove)
      });
    }
  };

  const handleCreateProfile = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      setError('Please log in to create a networking profile');
      return;
    }

    // Validate required fields with specific messages
    if (!newProfile.name?.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!newProfile.major?.trim()) {
      setError('Please enter your major');
      return;
    }
    if (!newProfile.year) {
      setError('Please select your year');
      return;
    }
    if (!newProfile.skills || newProfile.skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }
    if (!newProfile.linkedinUrl?.trim()) {
      setError('Please enter your LinkedIn URL');
      return;
    }
    // Validate LinkedIn URL format
    if (!newProfile.linkedinUrl.includes('linkedin.com/in/')) {
      setError('Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/your-profile)');
      return;
    }
    if (!newProfile.bio?.trim()) {
      setError('Please enter your bio');
      return;
    }
    if (newProfile.bio.trim().length < 10) {
      setError('Bio must be at least 10 characters long');
      return;
    }
    if (!newProfile.interests || newProfile.interests.length === 0) {
      setError('Please add at least one interest');
      return;
    }
    if (!newProfile.location?.trim()) {
      setError('Please enter your location');
      return;
    }
    if (!newProfile.email?.trim()) {
      setError('Please enter your email');
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newProfile.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const profileData = {
        name: newProfile.name,
        major: newProfile.major,
        year: newProfile.year,
        skills: newProfile.skills,
        linkedinUrl: newProfile.linkedinUrl,
        bio: newProfile.bio,
        interests: newProfile.interests,
        location: newProfile.location,
        email: newProfile.email
      };

      const response = await createNetworkingProfile(profileData);
      
      if (response.success && response.data) {
        // Add the new profile to the list
        setProfiles(prev => [response.data!, ...prev]);
    setShowCreateProfile(false);
    setNewProfile({
      name: '',
      major: '',
      year: '',
      skills: [],
      linkedinUrl: '',
      bio: '',
      interests: [],
      location: '',
      email: ''
    });
        setNewSkill('');
        setNewInterest('');
      } else {
        setError(response.message || 'Failed to create profile');
      }
    } catch (err: any) {
      console.error('Error creating profile:', err);
      setError(err.message || 'Failed to create profile. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateProfile(false);
    setError('');
    setNewProfile({
      name: '',
      major: '',
      year: '',
      skills: [],
      linkedinUrl: '',
      bio: '',
      interests: [],
      location: '',
      email: ''
    });
    setNewSkill('');
    setNewInterest('');
  };

  return (
    <Layout title="Collaboration Hub">
      <div className="py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Collaborate & Connect</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join projects, build your network, and create meaningful connections with fellow students
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            <div className="flex space-x-2">
              {[
                { id: 'projects', label: 'Projects', icon: Briefcase },
                { id: 'networking', label: 'Networking', icon: Users }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 max-w-2xl mx-auto">
              <Briefcase className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Project Collaboration Hub</h2>
              <p className="text-gray-300 mb-8">
                Discover exciting projects, collaborate with fellow students, and bring your ideas to life. 
                Create your own projects or join existing ones to build something amazing together.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/projects')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <p className="text-sm text-gray-400">
                  View all projects • Create new projects • Join collaborations
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Networking Tab */}
        {activeTab === 'networking' && (
          <div>
            {/* Header Section */}
            <div className="mb-8">
              {/* Authentication Notice */}
              {!isAuthenticated && (
                <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                  <p className="text-yellow-300 text-sm">
                    Please log in to create your networking profile and connect with other students.
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Skill Showcase Network</h2>
                  <p className="text-gray-300">Connect with like-minded students and showcase your expertise</p>
                </div>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setError('Please log in to create a networking profile');
                      return;
                    }
                    setShowCreateProfile(true);
                  }}
                  disabled={!isAuthenticated}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isAuthenticated 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transform hover:scale-105' 
                      : 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Profile</span>
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, major, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter by skill..."
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              </div>
            </div>

            {/* Profiles Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  <span className="text-white text-lg">Loading profiles...</span>
                </div>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <div key={profile._id} className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10">
                  {/* Profile Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {profile.name}
                        </h3>
                        <p className="text-sm text-gray-300">{profile.major}</p>
                      </div>
                    </div>
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 hover:scale-110"
                      title="Connect on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <GraduationCap className="h-4 w-4 text-purple-400" />
                      <span>{profile.year}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <MapPin className="h-4 w-4 text-pink-400" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Mail className="h-4 w-4 text-cyan-400" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">{profile.bio}</p>

                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getSkillColor(skill)}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-gray-500/20 text-gray-300"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connect Button */}
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-105 inline-block text-center shadow-lg hover:shadow-blue-500/25"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Connect on LinkedIn</span>
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </a>
                </div>
              ))}
            </div>
            )}

            {/* Empty State */}
            {!loading && filteredProfiles.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Profiles Found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or create your own profile!</p>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setError('Please log in to create a networking profile');
                      return;
                    }
                    setShowCreateProfile(true);
                  }}
                  disabled={!isAuthenticated}
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isAuthenticated 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transform hover:scale-105' 
                      : 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Your Profile</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Profile Modal */}
        {showCreateProfile && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create Your Profile</h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    disabled={creating}
                  >
                    <span className="text-white text-xl">×</span>
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {/* Form */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                      <input
                        type="text"
                        value={newProfile.name || ''}
                        onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Major</label>
                      <input
                        type="text"
                        value={newProfile.major || ''}
                        onChange={(e) => setNewProfile({...newProfile, major: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Year</label>
                      <select
                        value={newProfile.year || ''}
                        onChange={(e) => setNewProfile({...newProfile, year: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Location</label>
                      <input
                        type="text"
                        value={newProfile.location || ''}
                        onChange={(e) => setNewProfile({...newProfile, location: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        placeholder="e.g., Hyderabad"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                      type="email"
                      value={newProfile.email || ''}
                      onChange={(e) => setNewProfile({...newProfile, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="your.email@college.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={newProfile.linkedinUrl || ''}
                      onChange={(e) => setNewProfile({...newProfile, linkedinUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="https://linkedin.com/in/your-profile"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Bio</label>
                    <textarea
                      value={newProfile.bio || ''}
                      onChange={(e) => setNewProfile({...newProfile, bio: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 resize-none"
                      placeholder="Tell us about yourself, your interests, and what you're looking for... (minimum 10 characters)"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {newProfile.bio?.length || 0}/500 characters (minimum 10)
                    </p>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Skills *</label>
                    <p className="text-xs text-gray-400 mb-2">Add at least one skill (e.g., React, Python, Design)</p>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        placeholder="Add a skill (e.g., React, Python)"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newProfile.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getSkillColor(skill)}`}
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 hover:text-white transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Interests *</label>
                    <p className="text-xs text-gray-400 mb-2">Add at least one interest (e.g., AI, Entrepreneurship, Music)</p>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        placeholder="Add an interest (e.g., AI, Entrepreneurship)"
                      />
                      <button
                        onClick={handleAddInterest}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newProfile.interests?.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-500/20 text-gray-300"
                        >
                          {interest}
                          <button
                            onClick={() => handleRemoveInterest(interest)}
                            className="ml-2 hover:text-white transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateProfile}
                    disabled={creating}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Profile</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default CollaborationPage;