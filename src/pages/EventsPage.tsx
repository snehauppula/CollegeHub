import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Calendar, Clock, MapPin, Users, RefreshCw, ExternalLink } from 'lucide-react';
import { fetchEventsFromSheets, EventData } from '../utils/sheetsApi';

function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch real data from Google Sheets
  const fetchEvents = async () => {
    setLoading(true);
    const eventsData = await fetchEventsFromSheets();
    setEvents(eventsData);
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Workshop': 'from-cyan-500 to-blue-600',
      'Cultural': 'from-purple-500 to-pink-600',
      'Career': 'from-green-500 to-emerald-600',
      'Community Service': 'from-orange-500 to-red-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <Layout title="Events & Activities">
      <div className="py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Club Events</h1>
            <p className="text-gray-300">Discover and join exciting campus activities</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Last updated</p>
              <p className="text-sm text-cyan-300">{lastRefresh.toLocaleTimeString()}</p>
            </div>
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 text-white ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 animate-pulse">
                <div className="h-4 bg-white/20 rounded mb-4"></div>
                <div className="h-3 bg-white/20 rounded mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(event.category)} text-white text-xs font-semibold rounded-full`}>
                    {event.category}
                  </span>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {event.title}
                </h3>
                <p className="text-cyan-200 text-sm mb-3">{event.club}</p>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <MapPin className="h-4 w-4 text-pink-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Users className="h-4 w-4 text-green-400" />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-105">
                  Join Event
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Data Source Info */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-white">Live Data Integration</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Events are automatically synced from Google Sheets and refreshed every time the application loads. 
            Data is stored in Excel format for easy club management and real-time updates.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default EventsPage;