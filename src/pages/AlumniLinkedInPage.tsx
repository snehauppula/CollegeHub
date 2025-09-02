import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Linkedin, 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Calendar,
  ExternalLink,
  Star,
  MessageCircle
} from 'lucide-react';

interface AlumniProfile {
  id: string;
  name: string;
  graduationYear: string;
  major: string;
  currentPosition: string;
  company: string;
  location: string;
  linkedinUrl: string;
  profileImage: string;
  connections: number;
  rating: number;
  specialties: string[];
}

function AlumniLinkedInPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const mockAlumni: AlumniProfile[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      graduationYear: '2020',
      major: 'Computer Science',
      currentPosition: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
      profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      connections: 500,
      rating: 4.9,
      specialties: ['Machine Learning', 'Full Stack Development', 'Mentorship']
    },
    {
      id: '2',
      name: 'Michael Chen',
      graduationYear: '2019',
      major: 'Business Administration',
      currentPosition: 'Product Manager',
      company: 'Microsoft',
      location: 'Seattle, WA',
      linkedinUrl: 'https://linkedin.com/in/michaelchen',
      profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      connections: 750,
      rating: 4.8,
      specialties: ['Product Strategy', 'Team Leadership', 'Startup Advice']
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      graduationYear: '2021',
      major: 'Marketing',
      currentPosition: 'Digital Marketing Director',
      company: 'Adobe',
      location: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/emilyrodriguez',
      profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      connections: 420,
      rating: 4.7,
      specialties: ['Digital Marketing', 'Brand Strategy', 'Creative Direction']
    },
    {
      id: '4',
      name: 'David Kim',
      graduationYear: '2018',
      major: 'Engineering',
      currentPosition: 'Senior Data Scientist',
      company: 'Tesla',
      location: 'Austin, TX',
      linkedinUrl: 'https://linkedin.com/in/davidkim',
      profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      connections: 680,
      rating: 4.9,
      specialties: ['Data Science', 'AI/ML', 'Research']
    }
  ];

  const filteredAlumni = mockAlumni.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && alumni.major.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <Layout title="Alumni LinkedIn Network">
      <div className="py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl w-fit mx-auto mb-6">
            <Linkedin className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Alumni LinkedIn Network</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect with successful alumni, explore career paths, and get professional guidance
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, major, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-all duration-300"
            >
              <option value="all">All Majors</option>
              <option value="computer">Computer Science</option>
              <option value="business">Business</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
            </select>
            <button className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300">
              <Filter className="h-5 w-5" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumni) => (
            <div key={alumni.id} className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-blue-300/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={alumni.profileImage}
                  alt={alumni.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-400/30"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                    {alumni.name}
                  </h3>
                  <p className="text-sm text-blue-200">Class of {alumni.graduationYear}</p>
                  <p className="text-xs text-gray-300">{alumni.major}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-yellow-400">{alumni.rating}</span>
                </div>
              </div>

              {/* Current Position */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase className="h-4 w-4 text-purple-400" />
                  <span className="text-white font-semibold">{alumni.currentPosition}</span>
                </div>
                <p className="text-cyan-300 text-sm">{alumni.company}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-300 text-xs">{alumni.location}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {alumni.specialties.map((specialty, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connection Info */}
              <div className="flex items-center justify-between mb-4 text-sm text-gray-300">
                <span>{alumni.connections}+ connections</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Available for mentoring</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(alumni.linkedinUrl, '_blank')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>Connect</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
                <button className="px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all duration-300">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
            <p className="text-gray-300">Alumni Profiles</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
            <p className="text-gray-300">Companies Represented</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">95%</div>
            <p className="text-gray-300">Response Rate</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AlumniLinkedInPage;