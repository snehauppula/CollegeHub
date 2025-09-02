import React, { useState } from 'react';
import Layout from '../components/Layout';
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
  Clock
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  members: number;
  maxMembers: number;
  creator: string;
  timeCommitment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

function CollaborationPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'networking' | 'create'>('projects');
  const [searchTerm, setSearchTerm] = useState('');

  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Campus Sustainability App',
      description: 'Building a mobile app to track and reduce campus carbon footprint with gamification elements.',
      category: 'Technology',
      skills: ['React Native', 'Node.js', 'UI/UX Design'],
      members: 3,
      maxMembers: 6,
      creator: 'Sarah Chen',
      timeCommitment: '10-15 hours/week',
      difficulty: 'Intermediate'
    },
    {
      id: '2',
      title: 'Student Mental Health Research',
      description: 'Conducting research on student wellness and developing support resources for the campus community.',
      category: 'Research',
      skills: ['Psychology', 'Data Analysis', 'Survey Design'],
      members: 2,
      maxMembers: 5,
      creator: 'Dr. Martinez',
      timeCommitment: '5-8 hours/week',
      difficulty: 'Advanced'
    },
    {
      id: '3',
      title: 'Campus Art Installation',
      description: 'Creating an interactive digital art piece for the new student center lobby.',
      category: 'Creative',
      skills: ['Digital Art', 'Arduino', 'Creative Writing'],
      members: 4,
      maxMembers: 8,
      creator: 'Alex Rivera',
      timeCommitment: '8-12 hours/week',
      difficulty: 'Beginner'
    }
  ];

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Technology': Code,
      'Research': BookOpen,
      'Creative': Palette,
      'Business': Briefcase
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
                { id: 'networking', label: 'Networking', icon: Users },
                { id: 'create', label: 'Create Project', icon: Plus }
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
          <div>
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
              <button className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300">
                <Filter className="h-5 w-5" />
                <span>Filter</span>
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockProjects.map((project) => (
                <div key={project.id} className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
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
                        <span>{project.members}/{project.maxMembers}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{project.timeCommitment}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400">4.8</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300">
                      Join Project
                    </button>
                    <button className="px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all duration-300">
                      <MessageCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Networking Tab */}
        {activeTab === 'networking' && (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 max-w-2xl mx-auto">
              <Users className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Student Networking Hub</h2>
              <p className="text-gray-300 mb-8">
                Connect with students across different majors, join study groups, and build lasting friendships.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                  Find Study Partners
                </button>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                  Join Communities
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Project Tab */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Create New Project</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Project Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                    placeholder="Enter your project title..."
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300 resize-none"
                    placeholder="Describe your project..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Category</label>
                    <select className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all duration-300">
                      <option value="">Select category</option>
                      <option value="technology">Technology</option>
                      <option value="research">Research</option>
                      <option value="creative">Creative</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Team Size</label>
                    <input
                      type="number"
                      min="2"
                      max="20"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                      placeholder="Max team members"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Create Project
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CollaborationPage;