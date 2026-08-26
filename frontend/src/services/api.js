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

  // Update reservation status (admin)
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return parseResponse(response, 'Failed to update reservation');
  },

  // Delete reservation (admin)
  delete: async (id) => {
    const response = await fetch(`${API_URL}/reservations/${id}`, {
      method: 'DELETE',
    });
    return parseResponse(response, 'Failed to delete reservation');
  },
};

// Menu API
export const menuAPI = {
  // Get all menu items
  getAll: async (category = 'all', includeUnavailable = false) => {
    let url = `${API_URL}/menu?`;
    if (category && category !== 'all') url += `category=${category}&`;
    if (includeUnavailable) url += `includeUnavailable=true&`;
    
    const response = await fetch(url);
    return parseResponse(response, 'Failed to fetch menu items');
  },

  // Get single menu item
  getById: async (id) => {
    const response = await fetch(`${API_URL}/menu/${id}`);
    return parseResponse(response, 'Failed to fetch menu item');
  },

  // Create menu item (admin)
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

  // Update menu item (admin)
  update: async (id, menuData) => {
    const response = await fetch(`${API_URL}/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuData),
    });
    return parseResponse(response, 'Failed to update menu item');
  },

  // Delete menu item (admin)
  delete: async (id) => {
    const response = await fetch(`${API_URL}/menu/${id}`, {
      method: 'DELETE',
    });
    return parseResponse(response, 'Failed to delete menu item');
  },
};

// Orders API
export const orderAPI = {
  // Create new order (checkout)
  create: async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return parseResponse(response, 'Failed to place order');
  },

  // Get all orders (admin / history)
  getAll: async (status = 'all', email = null) => {
    let url = `${API_URL}/orders?`;
    if (status && status !== 'all') url += `status=${status}&`;
    if (email) url += `email=${encodeURIComponent(email)}&`;

    const response = await fetch(url);
    return parseResponse(response, 'Failed to fetch orders');
  },

  // Get single order
  getById: async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}`);
    return parseResponse(response, 'Failed to fetch order');
  },

  // Update order status (admin)
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return parseResponse(response, 'Failed to update order status');
  },

  // Delete order (admin)
  delete: async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    return parseResponse(response, 'Failed to delete order');
  },
};

// Contact API
export const contactAPI = {
  // Send / Submit contact message
  submit: async (contactData) => {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    return parseResponse(response, 'Failed to send message');
  },

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

  // Get all contact messages (admin)
  getAll: async () => {
    const response = await fetch(`${API_URL}/contact`);
    return parseResponse(response, 'Failed to fetch messages');
  },

  // Update contact status (admin)
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/contact/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return parseResponse(response, 'Failed to update contact status');
  },

  // Delete contact message (admin)
  delete: async (id) => {
    const response = await fetch(`${API_URL}/contact/${id}`, {
      method: 'DELETE',
    });
    return parseResponse(response, 'Failed to delete contact message');
  },
};

// Reviews API
export const reviewAPI = {
  // Get all reviews
  getAll: async () => {
    const response = await fetch(`${API_URL}/reviews`);
    return parseResponse(response, 'Failed to fetch reviews');
  },

  // Create review
  create: async (reviewData) => {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    return parseResponse(response, 'Failed to submit review');
  },

  // Delete review (admin)
  delete: async (id) => {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'DELETE',
    });
    return parseResponse(response, 'Failed to delete review');
  },
};

// Events & Catering API
export const eventAPI = {
  // Submit event inquiry
  create: async (eventData) => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return parseResponse(response, 'Failed to submit event inquiry');
  },

  // Get all event inquiries (admin)
  getAll: async () => {
    const response = await fetch(`${API_URL}/events`);
    return parseResponse(response, 'Failed to fetch event inquiries');
  },

  // Update status (admin)
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/events/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return parseResponse(response, 'Failed to update event status');
  },

  // Delete event inquiry (admin)
  delete: async (id) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
    });
    return parseResponse(response, 'Failed to delete event inquiry');
  },
};


