const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    console.error('API Error:', { status: response.status, data });
  }
  return data;
};

// Auth APIs
export const authApi = {
  googleAuth: async (idToken: string) => {
    try {
      console.log('Sending Google auth token...');
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ idToken })
      });
      const data = await handleResponse(response);
      console.log('Auth response:', data);
      return data;
    } catch (error) {
      console.error('Auth API error:', error);
      return { success: false, message: 'Network error', error };
    }
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Menu APIs
export const menuApi = {
  getMenuItems: async () => {
    const response = await fetch(`${API_BASE_URL}/menu`);
    return handleResponse(response);
  },

  getAllMenuItems: async () => {
    const response = await fetch(`${API_BASE_URL}/menu/admin/all`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  createMenuItem: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/menu/admin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateMenuItem: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/menu/admin/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deleteMenuItem: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/menu/admin/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  reorderMenuItems: async (items: any[]) => {
    const response = await fetch(`${API_BASE_URL}/menu/admin/reorder`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ items })
    });
    return handleResponse(response);
  }
};

// Upload API
export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/upload/admin/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return handleResponse(response);
  }
};

// Product APIs
export const productApi = {
  getProducts: async (filters: { menuItem?: string; columnId?: string; subMenuItemId?: string; page?: number; limit?: number } = {}) => {
    const params = new URLSearchParams();
    if (filters.menuItem) params.append('menuItem', filters.menuItem);
    if (filters.columnId) params.append('columnId', filters.columnId);
    if (filters.subMenuItemId) params.append('subMenuItemId', filters.subMenuItemId);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/products${query}`);
    return handleResponse(response);
  },

  getProductBySlug: async (slug: string) => {
    const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`);
    return handleResponse(response);
  },

  getAllProductsAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/products/admin/all`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  createProduct: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/products/admin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateProduct: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/products/admin/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/admin/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Cart APIs
export const cartApi = {
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  addToCart: async (data: { productId: string; size: string; color: string; quantity: number }) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateQuantity: async (data: { productId: string; size: string; color: string; quantity: number }) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  removeFromCart: async (data: { productId: string; size: string; color: string }) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Order APIs
export const orderApi = {
  createOrder: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  getMyOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/my`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getOrderById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getAllOrdersAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/admin/all`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (id: string, orderStatus: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/admin/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ orderStatus })
    });
    return handleResponse(response);
  },

  updatePaymentStatus: async (id: string, paymentStatus: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/admin/${id}/payment`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ paymentStatus })
    });
    return handleResponse(response);
  }
};
