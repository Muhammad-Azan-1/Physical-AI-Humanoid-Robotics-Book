import axios from 'axios';

// Get API base URL - Production Railway backend
const API_BASE_URL = 'https://web-production-7aa17.up.railway.app';

// Create axios instance with default settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interface for chat request
 */
export interface ChatRequest {
  message: string;
  sessionId?: string;
}

/**
 * Interface for chat response
 */
export interface ChatResponse {
  response: string;
  sessionId: string;
  timestamp: string;
  blocked?: boolean;
}

/**
 * Interface for error response
 */
export interface ErrorResponse {
  error: string;
  errorCode: string;
  details?: string;
}

/**
 * Send a message to the chatbot API
 */
export const sendMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post<ChatResponse>('/api/v1/', request);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorResponse: ErrorResponse = {
        error: error.response?.data?.error || 'Network error occurred',
        errorCode: error.response?.data?.errorCode || 'NETWORK_ERROR',
        details: error.response?.data?.details || error.message,
      };
      throw errorResponse;
    }

    // Handle non-axios errors
    const errorResponse: ErrorResponse = {
      error: 'Unknown error occurred',
      errorCode: 'UNKNOWN_ERROR',
      details: error instanceof Error ? error.message : 'An unknown error occurred',
    };
    throw errorResponse;
  }
};

/**
 * Check if the API is healthy
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/api/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

/**
 * Interface for session data
 */
export interface SessionData {
  sessionId: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    status?: 'sent' | 'processing' | 'error';
  }>;
}

/**
 * Get session data
 */
export const getSession = async (sessionId: string): Promise<SessionData> => {
  // Session endpoint not implemented in backend
  // For now, return a basic session structure
  throw new Error('Session endpoint not implemented');
};