import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
      items: [],
      addItem: (product, licenseType = 'single') => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === product.id && item.licenseType === licenseType
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.licenseType === licenseType
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...product, quantity: 1, licenseType }],
          });
        }
      },
      removeItem: (productId, licenseType) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === productId && item.licenseType === licenseType)
          ),
        });
      },
      updateQuantity: (productId, licenseType, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, licenseType);
        } else {
          set({
            items: get().items.map((item) =>
              item.id === productId && item.licenseType === licenseType
                ? { ...item, quantity }
                : item
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.licenseType === 'yearly' ? item.price_yearly : item.price_monthly;
          return total + price * item.quantity;
        }, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
}));

export const useWishlistStore = create((set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        if (!items.find((item) => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
      clearWishlist: () => set({ items: [] }),
}));

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: false,
  
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  
  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ user: data.user, session: data.session, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },
  
  signOut: async () => {
    set({ loading: true });
    try {
      const { supabase } = await import('../lib/supabase');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, session: null, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },
  
  checkAuth: async () => {
    set({ loading: true });
    try {
      const { supabase } = await import('../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        set({ user: session.user, session, loading: false });
        return true;
      }
      
      set({ user: null, session: null, loading: false });
      return false;
    } catch (error) {
      set({ loading: false });
      return false;
    }
  },
  
  logout: () => set({ user: null, session: null }),
}));

export const useUIStore = create((set, get) => ({
  toast: null,
  toastTimeout: null,
  showToast: (message, type = 'success') => {
    // Clear existing timeout
    const currentTimeout = get().toastTimeout;
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    
    // Set new toast
    set({ toast: { message, type, id: Date.now() } });
    
    // Set new timeout
    const newTimeout = setTimeout(() => {
      set({ toast: null, toastTimeout: null });
    }, 4000);
    
    set({ toastTimeout: newTimeout });
  },
  hideToast: () => {
    const currentTimeout = get().toastTimeout;
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    set({ toast: null, toastTimeout: null });
  },
  modal: null,
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));
