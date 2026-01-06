const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth API
export const authAPI = {
  // Register new user
  signup: async (userData) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(Array.isArray(data.error) ? data.error.join(', ') : data.error || 'Failed to sign up');
    }
    return data;
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to login');
    }
    return data;
  },

  // Get current user
  getCurrentUser: async (token) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get user');
    }
    return data;
  },
};

// Reservation API
export const reservationAPI = {
  // Create a new reservation
  create: async (reservationData) => {
    const response = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create reservation');
    }
    return data;
  },

  // Get all reservations
  getAll: async () => {
    const response = await fetch(`${API_URL}/reservations`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch reservations');
    }
    return data;
  },

  // Get single reservation
  getById: async (id) => {
    const response = await fetch(`${API_URL}/reservations/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch reservation');
    }
    return data;
  },
};

// Menu API
export const menuAPI = {
  // Get all menu items
  getAll: async (category = 'all') => {
    const url = category === 'all' 
      ? `${API_URL}/menu` 
      : `${API_URL}/menu?category=${category}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch menu items');
    }
    return data;
  },

  // Get single menu item
  getById: async (id) => {
    const response = await fetch(`${API_URL}/menu/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch menu item');
    }
    return data;
  },

  // Create menu item
  create: async (menuData) => {
    const response = await fetch(`${API_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create menu item');
    }
    return data;
  },
};

// Contact API
export const contactAPI = {
  // Send contact message
  send: async (contactData) => {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message');
    }
    return data;
  },
};
