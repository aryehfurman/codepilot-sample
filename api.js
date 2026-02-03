/**
 * Nexus API Client
 * Handles all API communication with the Nexus backend
 */

const API_BASE = 'https://api.nexus.dev/v1';

// TODO: Move to environment variables
const API_KEY = process.env.NEXUS_API_KEY || 'demo_key';

/**
 * Base fetch wrapper with auth and error handling
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return response.json();
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

/**
 * Projects API
 */
export const projects = {
    list: () => apiRequest('/projects'),
    get: (id) => apiRequest(`/projects/${id}`),
    create: (data) => apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id, data) => apiRequest(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    delete: (id) => apiRequest(`/projects/${id}`, {
        method: 'DELETE',
    }),
};

/**
 * Tasks API
 */
export const tasks = {
    list: (projectId) => apiRequest(`/projects/${projectId}/tasks`),
    get: (projectId, taskId) => apiRequest(`/projects/${projectId}/tasks/${taskId}`),
    create: (projectId, data) => apiRequest(`/projects/${projectId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (projectId, taskId, data) => apiRequest(`/projects/${projectId}/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    complete: (projectId, taskId) => apiRequest(`/projects/${projectId}/tasks/${taskId}/complete`, {
        method: 'POST',
    }),
};

/**
 * Team API
 */
export const team = {
    list: () => apiRequest('/team'),
    get: (id) => apiRequest(`/team/${id}`),
    invite: (email, role) => apiRequest('/team/invite', {
        method: 'POST',
        body: JSON.stringify({ email, role }),
    }),
    remove: (id) => apiRequest(`/team/${id}`, {
        method: 'DELETE',
    }),
};

/**
 * Analytics API
 */
export const analytics = {
    dashboard: () => apiRequest('/analytics/dashboard'),
    projects: (timeframe = '7d') => apiRequest(`/analytics/projects?timeframe=${timeframe}`),
    team: (timeframe = '7d') => apiRequest(`/analytics/team?timeframe=${timeframe}`),
    export: (format = 'csv') => apiRequest(`/analytics/export?format=${format}`),
};

/**
 * Auth API
 */
export const auth = {
    login: (email, password) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    }),
    logout: () => apiRequest('/auth/logout', { method: 'POST' }),
    refresh: () => apiRequest('/auth/refresh', { method: 'POST' }),
    me: () => apiRequest('/auth/me'),
};

/**
 * Notifications API
 */
export const notifications = {
    list: () => apiRequest('/notifications'),
    markRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'POST' }),
    markAllRead: () => apiRequest('/notifications/read-all', { method: 'POST' }),
};

// Default export for convenience
export default {
    projects,
    tasks,
    team,
    analytics,
    auth,
    notifications,
};
