// API Configuration
export const API_CONFIG = {
  // Set to true to use the backend API, false to use mock data
  USE_API: false, // Change this to true when you want to use the backend
  
  // API Base URL
  BASE_URL: 'http://localhost:3001',
  
  // Default user ID for API calls (in a real app, this would come from authentication)
  DEFAULT_USER_ID: 'user-123',
  
  // Endpoints
  ENDPOINTS: {
    VIDEOS: '/api/videos',
    FAVORITES: '/api/favorites',
    HEALTH: '/health'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 