import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  Users, 
  Briefcase, 
  Code, 
  Palette, 
  BookOpen,
  Plus,
  Search,
  Filter,
  Star,
  Clock,
  Edit,
  Trash2,
  Mail,
  Save,
  X,
  RefreshCw
} from 'lucide-react';
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  generateJoinEmailLink,
  ProjectData, 
  CreateProjectData 
} from '../utils/projectsApi';

function ProjectsPage() {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    category: '',
    skills: [],
    maxMembers: 2,
    timeCommitment: '',
    difficulty: 'Beginner'
  });

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjectsData();
  }, []);

  // Close modals if user becomes unauthenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setShowCreateModal(false);
      setEditingProject(null);
    }
  }, [isAuthenticated, user]);

  const fetchProjectsData = async () => {
    setLoading(true);
    try {
      const projectsData = await fetchProjects();
      setProjects(projectsData);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Fetch projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh projects data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProjectsData();
    setRefreshing(false);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login to create a project. Click the login button in the top navigation.');
      return;
    }

    try {
      const newProject = await createProject(formData);
      setProjects(prev => [newProject, ...prev]);
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        skills: [],
        maxMembers: 2,
        timeCommitment: '',
        difficulty: 'Beginner'
      });
      setSuccess('Project created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      // Refresh the projects list to show the new project
      await fetchProjectsData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      if (errorMessage.includes('Access token required')) {
        setError('Please login to create a project. Click the login button in the top navigation.');
      } else {
        setError(errorMessage);
      }
      console.error('Create project error:', err);
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const updatedProject = await updateProject(editingProject, formData);
      setProjects(prev => prev.map(p => p._id === editingProject ? updatedProject : p));
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        skills: [],
        maxMembers: 2,
        timeCommitment: '',
        difficulty: 'Beginner'
      });
      setSuccess('Project updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      // Refresh the projects list to show updated data
      await fetchProjectsData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      console.error('Update project error:', err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        setProjects(prev => prev.filter(p => p._id !== projectId));
        setSuccess('Project deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
        // Refresh the projects list to show updated data
        await fetchProjectsData();
      } catch (err) {
        setError('Failed to delete project');
        console.error('Delete project error:', err);
      }
    }
  };

  const handleStartEdit = (project: ProjectData) => {
    setEditingProject(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      skills: project.skills,
      maxMembers: project.maxMembers,
      timeCommitment: project.timeCommitment,
      difficulty: project.difficulty
    });
  };

  const handleJoinProject = (project: ProjectData) => {
    if (!isAuthenticated || !user) {
      setError('Please login to join a project. Click the login button in the top navigation.');
      return;
    }

    const emailLink = generateJoinEmailLink(
      project.creatorEmail,
      project.title,
      { name: user.name, email: user.email }
    );
    
    window.open(emailLink, '_blank');
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Technology': Code,
      'Research': BookOpen,
      'Creative': Palette,
      'Business': Briefcase,
      'Other': Briefcase
    };
    const IconComponent = icons[category as keyof typeof icons] || Code;
    return <IconComponent className="h-5 w-5" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Beginner': 'text-green-400 bg-green-400/20',
      'Intermediate': 'text-yellow-400 bg-yellow-400/20',
      'Advanced': 'text-red-400 bg-red-400/20'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-400 bg-gray-400/20';
  };

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Layout title="Projects">
        <div className="py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading projects...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Projects">
      <div className="py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="relative mb-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Project Collaboration Hub</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover exciting projects, collaborate with fellow students, and bring your ideas to life
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="absolute top-0 right-0 flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
              <p className="text-green-400 text-sm text-center">{success}</p>
            </div>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all duration-300 custom-select"
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Research">Research</option>
              <option value="Creative">Creative</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  if (!isAuthenticated || !user) {
                    setError('Please login to create a project. Click the login button in the top navigation.');
                    return;
                  }
                  setShowCreateModal(true);
                }}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all duration-300"
              >
                <Plus className="h-5 w-5" />
                <span>Create Project</span>
              </button>
            ) : (
              <div className="text-center">
                <p className="text-gray-300 text-sm mb-2">Login to create projects</p>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">
                  {searchTerm || selectedCategory ? 'No projects match your search criteria.' : 'No projects available yet.'}
                </p>
                {isAuthenticated && user && (
                  <button
                    onClick={() => {
                      if (!isAuthenticated || !user) {
                        setError('Please login to create a project. Click the login button in the top navigation.');
                        return;
                      }
                      setShowCreateModal(true);
                    }}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Create the First Project
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div key={project._id} className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                        {getCategoryIcon(project.category)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-purple-200">{project.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{project.currentMembers}/{project.maxMembers}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{project.timeCommitment}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      by {project.creatorName}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleJoinProject(project)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Join Project</span>
                    </button>
                    {isAuthenticated && user && project.creatorId === user.id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStartEdit(project)}
                          className="p-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl transition-all duration-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className="p-3 bg-red-500 hover:bg-red-400 text-white rounded-xl transition-all duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Project Modal */}
          {showCreateModal && isAuthenticated && user && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">Create New Project</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateProject} className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Project Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                      placeholder="Enter your project title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Description</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300 resize-none"
                      placeholder="Describe your project..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Category</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all duration-300 custom-select"
                      >
                        <option value="">Select category</option>
                        <option value="Technology">Technology</option>
                        <option value="Research">Research</option>
                        <option value="Creative">Creative</option>
                        <option value="Business">Business</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Max Team Size</label>
                      <input
                        type="number"
                        min="2"
                        max="20"
                        required
                        value={formData.maxMembers}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                        placeholder="Max team members"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Current Members</label>
                      <input
                        type="number"
                        min="1"
                        max={formData.maxMembers}
                        required
                        value={formData.currentMembers || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentMembers: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                        placeholder="Current members"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Time Commitment</label>
                      <input
                        type="text"
                        required
                        value={formData.timeCommitment}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeCommitment: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                        placeholder="e.g., 5-10 hours/week"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Difficulty</label>
                      <select
                        required
                        value={formData.difficulty}
                        onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all duration-300 custom-select"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Required Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.skills.join(', ')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        skills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill) 
                      }))}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                      placeholder="e.g., React, Node.js, UI/UX Design"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Project Modal */}
          {editingProject && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">Edit Project</h2>
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setFormData({
                        title: '',
                        description: '',
                        category: '',
                        skills: [],
                        maxMembers: 2,
                        timeCommitment: '',
                        difficulty: 'Beginner'
                      });
                    }}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
                
                <form onSubmit={handleEditProject} className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Project Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                      placeholder="Enter your project title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Description</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300 resize-none"
                      placeholder="Describe your project..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Category</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all duration-300 custom-select"
                      >
                        <option value="">Select category</option>
                        <option value="Technology">Technology</option>
                        <option value="Research">Research</option>
                        <option value="Creative">Creative</option>
                        <option value="Business">Business</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Max Team Size</label>
                      <input
                        type="number"
                        min="2"
                        max="20"
                        required
                        value={formData.maxMembers}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                        placeholder="Max team members"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Time Commitment</label>
                      <input
                        type="text"
                        required
                        value={formData.timeCommitment}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeCommitment: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                        placeholder="e.g., 5-10 hours/week"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Difficulty</label>
                      <select
                        required
                        value={formData.difficulty}
                        onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all duration-300 custom-select"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Required Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.skills.join(', ')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        skills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill) 
                      }))}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                      placeholder="e.g., React, Node.js, UI/UX Design"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setFormData({
                          title: '',
                          description: '',
                          category: '',
                          skills: [],
                          maxMembers: 2,
                          timeCommitment: '',
                          difficulty: 'Beginner'
                        });
                      }}
                      className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                      Update Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ProjectsPage;
