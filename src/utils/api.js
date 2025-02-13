// src/utils/api.js

const API_URL = 'https://chat-server-z4cd.onrender.com';

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'An error occurred');
    }
    return response.json();
};

// Helper function to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = {
    // Authentication
    auth: {
        login: async (identifier, password) => {
            const response = await fetch(`${API_URL}/api/auth/local`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });
            return handleResponse(response);
        },

        register: async (username, email, password) => {
            const response = await fetch(`${API_URL}/api/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            return handleResponse(response);
        },

        getMe: async () => {
            const response = await fetch(`${API_URL}/api/users/me`, {
                headers: {
                    ...getAuthHeader(),
                },
            });
            return handleResponse(response);
        },
    },

    // Messages
    messages: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/api/messages`, {
                headers: {
                    ...getAuthHeader(),
                },
            });
            return handleResponse(response);
        },

        create: async (message) => {
            const response = await fetch(`${API_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ data: { message } }),
            });
            return handleResponse(response);
        },
    },

    // Chat sessions
    sessions: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/api/chat-sessions`, {
                headers: {
                    ...getAuthHeader(),
                },
            });
            return handleResponse(response);
        },

        create: async (name) => {
            const response = await fetch(`${API_URL}/api/chat-sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ data: { name } }),
            });
            return handleResponse(response);
        },

        getMessages: async (sessionId) => {
            const response = await fetch(`${API_URL}/api/chat-sessions/${sessionId}/messages`, {
                headers: {
                    ...getAuthHeader(),
                },
            });
            return handleResponse(response);
        },
    },

    // Error handling
    handleError: (error) => {
        console.error('API Error:', error);
        if (error.message === 'Invalid token') {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        throw error;
    },
};

// Request interceptor
const apiRequest = async (endpoint, options = {}) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
            ...options.headers,
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        return handleResponse(response);
    } catch (error) {
        return api.handleError(error);
    }
};

// Usage example with the request interceptor
const enhancedApi = {
    ...api,
    request: apiRequest,
};

export default enhancedApi;