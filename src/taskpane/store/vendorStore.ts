import { create } from 'zustand';
import { useAuth } from './authStore';

interface Vendor {
  id: string;
  name: string;
  payment_schedule: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VendorState {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  fetchVendors: () => Promise<void>;
  createVendor: (name: string, payment_schedule: string) => Promise<boolean>;
  updateVendor: (id: string, data: Partial<Vendor>) => Promise<boolean>;
  deleteVendor: (id: string) => Promise<boolean>;
}

const API_BASE_URL = 'https://sturdy-rampart-455614-f6.el.r.appspot.com/';

export const useVendorStore = create<VendorState>((set) => ({
  vendors: [],
  loading: false,
  error: null,

  fetchVendors: async () => {
    const { token } = useAuth.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/vendors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        set({ vendors: data.data.vendors });
      } else {
        set({ error: data.message });
      }
    } catch (error) {
      set({ error: 'Failed to fetch vendors' });
    } finally {
      set({ loading: false });
    }
  },

  createVendor: async (name: string, payment_schedule: string) => {
    const { token } = useAuth.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/vendors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, payment_schedule }),
      });
      const data = await response.json();
      if (data.success) {
        set((state) => ({ vendors: [...state.vendors, data.data.vendor] }));
        return true;
      }
      set({ error: data.message });
      return false;
    } catch (error) {
      set({ error: 'Failed to create vendor' });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateVendor: async (id: string, data: Partial<Vendor>) => {
    const { token } = useAuth.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/vendors/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        set((state) => ({
          vendors: state.vendors.map((vendor) =>
            vendor.id === id ? { ...vendor, ...data } : vendor
          ),
        }));
        return true;
      }
      set({ error: result.message });
      return false;
    } catch (error) {
      set({ error: 'Failed to update vendor' });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteVendor: async (id: string) => {
    const { token } = useAuth.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/vendors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          vendors: state.vendors.filter((vendor) => vendor.id !== id),
        }));
        return true;
      }
      set({ error: data.message });
      return false;
    } catch (error) {
      set({ error: 'Failed to delete vendor' });
      return false;
    } finally {
      set({ loading: false });
    }
  },
})); 