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

// Image Compression Helper (Canvas-based)
const compressImage = (file: File, maxWidth = 1200, quality = 0.85): Promise<File> => {
  return new Promise((resolve) => {
    // Only compress image formats (exclude svgs, etc.)
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      resolve(file);
      return;
    }

    // Skip compression if the file is already small (e.g. under 500KB)
    if (file.size < 500 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Proportional resize to maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        const mimeType = file.type;
        const exportType = mimeType === 'image/png' ? 'image/png' : 'image/jpeg';

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const dotIndex = file.name.lastIndexOf('.');
            const baseName = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
            const extension = mimeType === 'image/png' ? 'png' : 'jpg';
            
            const compressedFile = new File([blob], `${baseName}.${extension}`, {
              type: exportType,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          exportType,
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

// Upload API
export const uploadApi = {
  uploadImage: async (file: File) => {
    let fileToUpload = file;
    try {
      fileToUpload = await compressImage(file);
      console.log(`Image upload: Original size: ${(file.size / 1024).toFixed(1)}KB, Uploading size: ${(fileToUpload.size / 1024).toFixed(1)}KB`);
    } catch (e) {
      console.error('Image compression failed, using original file:', e);
    }

    const formData = new FormData();
    formData.append('image', fileToUpload);

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
  getProducts: async (filters: { menuItem?: string; columnId?: string; subMenuItemId?: string; page?: number; limit?: number; search?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.menuItem) params.append('menuItem', filters.menuItem);
    if (filters.columnId) params.append('columnId', filters.columnId);
    if (filters.subMenuItemId) params.append('subMenuItemId', filters.subMenuItemId);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.search) params.append('search', filters.search);

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
  },

  createProductReview: async (id: string, data: { rating: number; comment: string }) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
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

  createRazorpayOrder: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/orders/razorpay/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  verifyRazorpayPayment: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/orders/razorpay/verify`, {
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
  },

  deleteOrderAdmin: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/admin/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Banner APIs
export const bannerApi = {
  getActiveBanner: async () => {
    const response = await fetch(`${API_BASE_URL}/banners/active`);
    return handleResponse(response);
  },

  getAllBannersAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/banners`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  createBanner: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/banners`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateBanner: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deleteBanner: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getHighlights: async () => {
    const response = await fetch(`${API_BASE_URL}/banners/highlights`);
    return handleResponse(response);
  },

  saveHighlights: async (highlights: any[]) => {
    const response = await fetch(`${API_BASE_URL}/banners/highlights`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ highlights })
    });
    return handleResponse(response);
  }
};

// Settings APIs
export const settingsApi = {
  getSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/settings`);
    return handleResponse(response);
  },

  saveSettings: async (settings: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ settings })
    });
    return handleResponse(response);
  }
};
