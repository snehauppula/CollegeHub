import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Mail, 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Calendar,
  Copy,
  Star,
  Send,
  GraduationCap
} from 'lucide-react';

interface AlumniContact {
  id: string;
  name: string;
  graduationYear: string;
  major: string;
  currentPosition: string;
  company: string;
  location: string;
  email: string;
  profileImage: string;
  responseTime: string;
  rating: number;
  specialties: string[];
  mentorshipAvailable: boolean;
}

function AlumniEmailPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const mockContacts: AlumniContact[] = [
    {
      id: '1',
      name: 'Jennifer Walsh',
      graduationYear: '2017',
      major: 'Computer Science',
      currentPosition: 'Tech Lead',
      company: 'Apple',
      location: 'Cupertino, CA',
      email: 'jennifer.walsh@apple.com',
      profileImage: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      responseTime: 'Usually responds within 2 hours',
      rating: 4.9,
      specialties: ['iOS Development', 'Team Leadership', 'Career Guidance'],
      mentorshipAvailable: true
    },
    {
      id: '2',
      name: 'Robert Martinez',
      graduationYear: '2016',
      major: 'Business Administration',
      currentPosition: 'VP of Operations',
      company: 'Amazon',
      location: 'Seattle, WA',
      email: 'robert.martinez@amazon.com',
      profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      responseTime: 'Usually responds within 1 day',
      rating: 4.8,
      specialties: ['Operations Management', 'Strategic Planning', 'Entrepreneurship'],
      mentorshipAvailable: true
    },
    {
      id: '3',
      name: 'Lisa Thompson',
      graduationYear: '2019',
      major: 'Marketing',
      currentPosition: 'Creative Director',
      company: 'Nike',
      location: 'Portland, OR',
      email: 'lisa.thompson@nike.com',
      profileImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      responseTime: 'Usually responds within 4 hours',
      rating: 4.7,
      specialties: ['Brand Marketing', 'Creative Strategy', 'Design Thinking'],
      mentorshipAvailable: false
    },
    {
      id: '4',
      name: 'James Wilson',
      graduationYear: '2015',
      major: 'Engineering',
      currentPosition: 'Principal Engineer',
      company: 'SpaceX',
      location: 'Hawthorne, CA',
      email: 'james.wilson@spacex.com',
      profileImage: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      responseTime: 'Usually responds within 6 hours',
      rating: 4.9,
      specialties: ['Aerospace Engineering', 'Systems Design', 'Innovation'],
      mentorshipAvailable: true
    }
  ];

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'mentors') return matchesSearch && contact.mentorshipAvailable;
    return matchesSearch && contact.major.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <Layout title="Alumni Email Directory">
      <div className="py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl w-fit mx-auto mb-6">
            <Mail className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Alumni Email Directory</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Direct access to verified alumni email contacts for mentorship and professional guidance
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
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition-all duration-300"
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-red-400 transition-all duration-300"
            >
              <option value="all">All Alumni</option>
              <option value="mentors">Available Mentors</option>
              <option value="computer">Computer Science</option>
              <option value="business">Business</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
            </select>
            <button className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300">
              <Filter className="h-5 w-5" />
              <span>Advanced</span>
            </button>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-red-300/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/20">
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={contact.profileImage}
                    alt={contact.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-400/30"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                      {contact.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-red-200">
                      <GraduationCap className="h-4 w-4" />
                      <span>Class of {contact.graduationYear}</span>
                    </div>
                    <p className="text-sm text-gray-300">{contact.major}</p>
                  </div>
                </div>
                {contact.mentorshipAvailable && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                    Mentor
                  </span>
                )}
              </div>

              {/* Current Position */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Briefcase className="h-4 w-4 text-purple-400" />
                  <span className="text-white font-semibold">{contact.currentPosition}</span>
                </div>
                <p className="text-cyan-300 text-sm">{contact.company}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-300 text-xs">{contact.location}</span>
                </div>
              </div>

              {/* Email Section */}
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Email Address</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-yellow-400">{contact.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-sm text-cyan-300 bg-black/20 px-3 py-2 rounded-lg">
                    {contact.email}
                  </code>
                  <button
                    onClick={() => copyEmail(contact.email)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 transition-all duration-300"
                  >
                    {copiedEmail === contact.email ? (
                      <span className="text-xs">Copied!</span>
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">{contact.responseTime}</p>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {contact.specialties.map((specialty, index) => (
                    <span key={index} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-500/30">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Guidelines */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Mail className="h-5 w-5 text-red-400" />
            <span>Email Guidelines</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Best Practices:</h4>
              <ul className="space-y-1">
                <li>• Be specific about your goals</li>
                <li>• Keep initial emails concise</li>
                <li>• Mention your college connection</li>
                <li>• Be respectful of their time</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Response Times:</h4>
              <ul className="space-y-1">
                <li>• Most alumni respond within 24-48 hours</li>
                <li>• Mentors typically respond faster</li>
                <li>• Follow up politely after 1 week</li>
                <li>• Be patient during busy periods</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AlumniEmailPage;