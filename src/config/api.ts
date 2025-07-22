// API Configuration
// Similar to application.yaml in Spring Boot, this file centralizes all API-related configuration

export const API_CONFIG = {
  // Backend base URL - update this when switching environments
  BASE_URL: 'https://d5b4c6929a81.ngrok-free.app',
  
  // API endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    UPLOAD: '/upload',
    QUERY: '/query',
  },
  
  // Request configuration
  REQUEST: {
    TIMEOUT: 30000, // 30 seconds
    HEADERS: {
      NGROK_SKIP_WARNING: 'ngrok-skip-browser-warning',
    },
  },
  
  // File upload constraints
  UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ],
    ALLOWED_EXTENSIONS: ['.pdf', '.docx', '.doc'],
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};

// Environment-specific configurations
export const getApiConfig = () => {
  // In a real application, you might switch based on NODE_ENV
  // For now, we'll use the default configuration
  return API_CONFIG;
};