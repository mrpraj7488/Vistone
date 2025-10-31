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
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  logout: () => set({ user: null, session: null }),
}));

export const useUIStore = create((set) => ({
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type, id: Date.now() } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  hideToast: () => set({ toast: null }),
  modal: null,
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));
