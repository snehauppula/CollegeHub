const API_BASE_URL = 'http://localhost:5000/api';

export interface ProjectData {
  _id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  maxMembers: number;
  currentMembers: number;
  timeCommitment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  category: string;
  skills: string[];
  maxMembers: number;
  currentMembers?: number;
  timeCommitment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  status?: 'Active' | 'Completed' | 'Cancelled';
}

// Get authentication token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Generic API request function (with authentication)
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Access token required');
  }
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Public API request function (no authentication required)
const publicApiRequest = async (url: string, options: RequestInit = {}) => {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Fetch all projects
export const fetchProjects = async (): Promise<ProjectData[]> => {
  try {
    const response = await publicApiRequest('/projects');
    return response.projects || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Fetch single project
export const fetchProject = async (id: string): Promise<ProjectData> => {
  try {
    const response = await publicApiRequest(`/projects/${id}`);
    return response.project;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

// Create new project
export const createProject = async (projectData: CreateProjectData): Promise<ProjectData> => {
  try {
    const response = await apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    return response.project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update project
export const updateProject = async (id: string, projectData: UpdateProjectData): Promise<ProjectData> => {
  try {
    const response = await apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
    return response.project;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete project
export const deleteProject = async (id: string): Promise<void> => {
  try {
    await apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Fetch projects by user
export const fetchUserProjects = async (userId: string): Promise<ProjectData[]> => {
  try {
    const response = await apiRequest(`/projects/user/${userId}`);
    return response.projects || [];
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw error;
  }
};

// Generate email link for joining project (redirects to Gmail)
export const generateJoinEmailLink = (creatorEmail: string, projectTitle: string, userDetails: { name: string; email: string }): string => {
  const subject = encodeURIComponent(`Interest in joining "${projectTitle}" project`);
  const body = encodeURIComponent(
    `Hi there!\n\nI'm interested in joining your project "${projectTitle}".\n\n` +
    `My details:\n` +
    `Name: ${userDetails.name}\n` +
    `Email: ${userDetails.email}\n\n` +
    `Please let me know if there's a spot available and what the next steps are.\n\n` +
    `Looking forward to collaborating!\n\n` +
    `Best regards,\n${userDetails.name}`
  );
  
  // Use Gmail's compose URL to force opening in Gmail instead of default email client
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${creatorEmail}&su=${subject}&body=${body}`;
};
