import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Users, 
  Briefcase, 
  Code, 
  Palette, 
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  ArrowRight
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'networking'>('projects');
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

      </div>
    </Layout>
  );
}

export default CollaborationPage;