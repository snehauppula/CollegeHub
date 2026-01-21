export interface NetworkingProfile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  name: string;
  major: string;
  year: string;
  skills: string[];
  linkedinUrl: string;
  bio: string;
  interests: string[];
  location: string;
  email: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileData {
  name: string;
  major: string;
  year: string;
  skills: string[];
  linkedinUrl: string;
  bio: string;
  interests: string[];
  location: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    current: number;
    total: number;
    count: number;
    totalCount: number;
  };
}

const API_BASE_URL = 'https://collegehub-xyp6.onrender.com/api/networking';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Get all networking profiles with search and filter
export const getNetworkingProfiles = async (
  search?: string,
  skill?: string,
  page: number = 1,
  limit: number = 12
): Promise<ApiResponse<NetworkingProfile[]>> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (skill) params.append('skill', skill);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  return apiRequest<NetworkingProfile[]>(`/profiles?${params.toString()}`);
};

// Get a specific networking profile
export const getNetworkingProfile = async (id: string): Promise<ApiResponse<NetworkingProfile>> => {
  return apiRequest<NetworkingProfile>(`/profiles/${id}`);
};

// Create a new networking profile
export const createNetworkingProfile = async (
  profileData: CreateProfileData
): Promise<ApiResponse<NetworkingProfile>> => {
  return apiRequest<NetworkingProfile>('/profiles', {
    method: 'POST',
    body: JSON.stringify(profileData),
  });
};

// Update a networking profile
export const updateNetworkingProfile = async (
  id: string,
  profileData: Partial<CreateProfileData>
): Promise<ApiResponse<NetworkingProfile>> => {
  return apiRequest<NetworkingProfile>(`/profiles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

// Delete a networking profile
export const deleteNetworkingProfile = async (id: string): Promise<ApiResponse<void>> => {
  return apiRequest<void>(`/profiles/${id}`, {
    method: 'DELETE',
  });
};

// Get current user's profile
export const getMyProfile = async (): Promise<ApiResponse<NetworkingProfile>> => {
  return apiRequest<NetworkingProfile>('/my-profile');
};
