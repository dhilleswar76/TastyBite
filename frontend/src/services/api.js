const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? '/api' : 'https://tastybite-usn6.onrender.com/api'
);

// Helper to safely parse JSON responses and extract proper errors
const parseResponse = async (response, defaultError = 'Request failed') => {
  let data = null;
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await response.text();
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let errorMessage = defaultError;
    if (data) {
      if (Array.isArray(data.error)) {
        errorMessage = data.error.join(', ');
      } else if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      }
    } else {
      errorMessage = `Server Error (${response.status}: ${response.statusText || 'Unknown Error'})`;
    }
    throw new Error(errorMessage);
  }

  return data || {};
};

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
    return parseResponse(response, 'Failed to sign up');
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
    return parseResponse(response, 'Failed to login');
  },

  // Get current user
  getCurrentUser: async (token) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response, 'Failed to get user');
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
    return parseResponse(response, 'Failed to create reservation');
  },

  // Get all reservations
  getAll: async () => {
    const response = await fetch(`${API_URL}/reservations`);
    return parseResponse(response, 'Failed to fetch reservations');
  },

  // Get single reservation
  getById: async (id) => {
    const response = await fetch(`${API_URL}/reservations/${id}`);
    return parseResponse(response, 'Failed to fetch reservation');
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
    return parseResponse(response, 'Failed to fetch menu items');
  },

  // Get single menu item
  getById: async (id) => {
    const response = await fetch(`${API_URL}/menu/${id}`);
    return parseResponse(response, 'Failed to fetch menu item');
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
    return parseResponse(response, 'Failed to create menu item');
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
    return parseResponse(response, 'Failed to send message');
  },
};
