export interface EventData {
  _id: string;
  clubName: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  fee: string;
  gmail: string;
  phone: string;
  joinLink: string;
  description?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    clubName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  eventName: string;
  eventDate: string;
  eventVenue: string;
  fee?: string;
  gmail: string;
  phone: string;
  joinLink?: string;
  description?: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Get all events (public endpoint)
export const fetchEvents = async (): Promise<EventData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    const data = await response.json();
    
    if (data.success) {
      return data.events;
    } else {
      throw new Error(data.message || 'Failed to fetch events');
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get events created by the authenticated user
export const fetchMyEvents = async (): Promise<EventData[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/events/my`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.events;
    } else {
      throw new Error(data.message || 'Failed to fetch your events');
    }
  } catch (error) {
    console.error('Error fetching my events:', error);
    throw error;
  }
};

// Create a new event
export const createEvent = async (eventData: CreateEventData): Promise<EventData> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.event;
    } else {
      throw new Error(data.message || 'Failed to create event');
    }
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an event
export const updateEvent = async (eventId: string, eventData: Partial<CreateEventData>): Promise<EventData> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.event;
    } else {
      throw new Error(data.message || 'Failed to update event');
    }
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete event');
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
