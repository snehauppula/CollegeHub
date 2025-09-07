import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Calendar, MapPin, DollarSign, Mail, ExternalLink, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CreateEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    clubName: '',
    eventName: '',
    description: '',
    eventDate: '',
    eventVenue: '',
    fee: '0',
    gmail: '',
    joinLink: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Here you can add logic to send the event data to your backend or Google Sheets
      console.log('Creating new event:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Event created successfully!');
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (err) {
      setError('Failed to create event. Please try again.');
      console.error('Create event error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/organizer-login');
  };

  return (
    <Layout title="Create New Event">
      <div className="py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Organizer Portal</span>
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">Create New Event</h1>
            <p className="text-gray-300">Add a new event to your club's calendar</p>
          </div>

          {/* Create Event Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Club Name */}
              <div>
                <label className="block text-white font-semibold mb-2">Club Name</label>
                <input
                  type="text"
                  value={formData.clubName}
                  onChange={(e) => setFormData({...formData, clubName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                  placeholder="Enter your club name"
                  required
                />
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-white font-semibold mb-2">Event Name</label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                  placeholder="Enter event name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300 resize-none"
                  placeholder="Describe your event"
                  required
                />
              </div>

              {/* Date and Venue Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Date */}
                <div>
                  <label className="block text-white font-semibold mb-2">Event Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Event Venue */}
                <div>
                  <label className="block text-white font-semibold mb-2">Event Venue</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.eventVenue}
                      onChange={(e) => setFormData({...formData, eventVenue: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                      placeholder="Enter venue"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Fee and Contact Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Fee */}
                <div>
                  <label className="block text-white font-semibold mb-2">Event Fee</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.fee}
                      onChange={(e) => setFormData({...formData, fee: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-white font-semibold mb-2">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.gmail}
                      onChange={(e) => setFormData({...formData, gmail: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                      placeholder="contact@example.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Join Link */}
              <div>
                <label className="block text-white font-semibold mb-2">Join Link (Optional)</label>
                <div className="relative">
                  <ExternalLink className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.joinLink}
                    onChange={(e) => setFormData({...formData, joinLink: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                    placeholder="https://meet.google.com/..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Event...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Create Event</span>
                  </div>
                )}
              </button>
            </form>

            {/* Status Messages */}
            {error && (
              <div className="mt-6 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mt-6 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                <p className="text-green-400 text-sm text-center">{success}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateEventPage;
