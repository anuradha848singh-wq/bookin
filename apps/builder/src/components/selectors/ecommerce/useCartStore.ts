import { create } from 'zustand';

export interface CartItem {
  id: string; // product id
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: { id: string; name: string; price: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  
  addItem: (product) => set((state) => {
    const existing = state.items.find(i => i.id === product.id);
    if (existing) {
      return {
        items: state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      };
    }
    return { items: [...state.items, { ...product, quantity: 1 }], isOpen: true };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),

  updateQuantity: (id, qty) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, quantity: qty } : i)
  })),

  setIsOpen: (isOpen) => set({ isOpen }),
  
  clearCart: () => set({ items: [] })
}));
