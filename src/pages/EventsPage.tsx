import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Calendar, MapPin, DollarSign, Mail, Phone, ExternalLink, RefreshCw, Plus, Edit, Trash2 } from 'lucide-react';
import { fetchEvents, createEvent, updateEvent, deleteEvent, EventData, CreateEventData } from '../utils/eventsApi';
import { useAuth } from '../contexts/AuthContext';

function EventsPage() {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch events from MongoDB
  const fetchEventsData = async () => {
    setLoading(true);
    setError('');
    try {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh events data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEventsData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  const getFeeColor = (fee: string) => {
    if (fee === '0' || fee.toLowerCase() === 'free') {
      return 'from-green-500 to-emerald-600';
    }
    return 'from-orange-500 to-red-600';
  };

  // Organizer functions
  const handleCreateEvent = () => {
    setShowCreateForm(true);
    setEditingEvent(null);
  };

  const handleEditEvent = (event: EventData) => {
    setEditingEvent(event);
    setShowCreateForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        setSuccess('Event deleted successfully!');
        await fetchEventsData(); // Refresh the list
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete event. Please try again.');
        console.error('Error deleting event:', err);
        setTimeout(() => setError(''), 5000);
      }
    }
  };

  const isEventOwner = (event: EventData) => {
    return user?.isOrganizer && user?.email === event.createdBy?.email;
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const eventData: CreateEventData = {
      eventName: formData.get('eventName') as string,
      eventDate: formData.get('eventDate') as string,
      eventVenue: formData.get('eventVenue') as string,
      fee: formData.get('fee') as string || 'Free',
      gmail: formData.get('gmail') as string,
      phone: formData.get('phone') as string,
      joinLink: formData.get('joinLink') as string || '',
      description: formData.get('description') as string || ''
    };

    try {
      if (editingEvent) {
        await updateEvent(editingEvent._id, eventData);
        setSuccess('Event updated successfully!');
      } else {
        await createEvent(eventData);
        setSuccess('Event created successfully!');
      }
      
      setShowCreateForm(false);
      setEditingEvent(null);
      await fetchEventsData(); // Refresh the list
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(editingEvent ? 'Failed to update event. Please try again.' : 'Failed to create event. Please try again.');
      console.error('Error saving event:', err);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <Layout title="Events & Activities">
      <div className="py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Club Events</h1>
            <p className="text-gray-300">Discover and join exciting campus activities</p>
            {user?.isOrganizer && (
              <p className="text-cyan-300 text-sm mt-1">
                Welcome, {user.name}! You can create and manage events for {user.clubName}.
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {user?.isOrganizer && (
              <button
                onClick={handleCreateEvent}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Create Event</span>
              </button>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
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
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
            <p className="text-gray-400 mb-6">Check back later for exciting campus events!</p>
            {user?.isOrganizer && (
              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Create First Event</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col space-y-2">
                    <span className={`inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r ${getFeeColor(event.fee)} text-white text-sm font-semibold rounded-full shadow-lg min-w-[60px]`}>
                      {event.fee === '0' ? (
                        <>
                          <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                          Free
                        </>
                      ) : (
                        <>
                          <span className="text-lg mr-1">₹</span>
                          {event.fee}
                        </>
                      )}
                    </span>
                    {event.joinLink && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                        Join Link Available
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {isEventOwner(event) && (
                      <>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Edit Event"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {event.joinLink && (
                      <a 
                        href={event.joinLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Open Join Link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {event.eventName}
                  </h3>
                  <p className="text-cyan-200 text-sm font-medium">{event.clubName}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/20 rounded-lg">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                    </div>
                    <span className="text-gray-300 font-medium">{event.eventDate}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 bg-pink-500/20 rounded-lg">
                      <MapPin className="h-4 w-4 text-pink-400" />
                    </div>
                    <span className="text-gray-300 font-medium">{event.eventVenue}</span>
                  </div>
                  
                  {event.gmail && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg">
                        <Mail className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-gray-300 font-medium truncate">{event.gmail}</span>
                    </div>
                  )}
                  
                  {event.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg">
                        <Phone className="h-4 w-4 text-purple-400" />
                      </div>
                      <span className="text-gray-300 font-medium">{event.phone}</span>
                    </div>
                  )}
                </div>
                
                {event.joinLink ? (
                  <a 
                    href={event.joinLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-105 inline-block text-center shadow-lg hover:shadow-cyan-500/25"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Join Event</span>
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </a>
                ) : (
                  <button 
                    disabled
                    className="w-full bg-gray-500/50 text-gray-400 font-semibold py-3 px-4 rounded-xl cursor-not-allowed border border-gray-600/50"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Join Link Not Available</span>
                      <span className="text-xs">(Contact Organizer)</span>
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Event Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingEvent(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Event Name</label>
                  <input
                    type="text"
                    name="eventName"
                    defaultValue={editingEvent?.eventName || ''}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                    placeholder="Enter event name"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    defaultValue={editingEvent?.eventDate || ''}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Venue</label>
                  <input
                    type="text"
                    name="eventVenue"
                    defaultValue={editingEvent?.eventVenue || ''}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                    placeholder="Enter venue"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Fee</label>
                  <input
                    type="text"
                    name="fee"
                    defaultValue={editingEvent?.fee || 'Free'}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                    placeholder="Enter fee (e.g., Free, $10, etc.)"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Contact Email</label>
                  <input
                    type="email"
                    name="gmail"
                    defaultValue={editingEvent?.gmail || ''}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                    placeholder="Enter contact email"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingEvent?.phone || ''}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                    placeholder="Enter contact phone"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Join Link (Optional)</label>
                  <input
                    type="url"
                    name="joinLink"
                    defaultValue={editingEvent?.joinLink || ''}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                    placeholder="Enter join link (optional)"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingEvent?.description || ''}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300 resize-none"
                    placeholder="Enter event description"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingEvent(null);
                    }}
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
            <p className="text-green-400 text-sm text-center">{success}</p>
          </div>
        )}

        {/* Data Source Info */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-white">MongoDB Database</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Events are stored in MongoDB database and managed through our secure API. 
            Organizers can create, edit, and delete their events directly from this page.
          </p>
          <div className="mt-3 text-xs text-gray-400">
            <p>Database: MongoDB Atlas | API: RESTful endpoints</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EventsPage;