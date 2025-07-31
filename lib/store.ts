// lib/store.ts
import { create } from 'zustand';

export type Shoe = {
  id: string;
  brand: string;
  model: string;
  price: number;
  image: number;     // static require(...)
  selectedSize?: number;
};

type SwipeDir = 'left' | 'right' | 'up';

export type Filters = {
  size: number | null;
  brand: string | null;
  color: string | null;
  category: string | null;
  priceRange: [number, number] | null;
};

export type ShippingInfo = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

export type Order = {
  id: string;
  items: Shoe[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingInfo: ShippingInfo;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
};

type StoreState = {
  liked: Shoe[];
  cart: Shoe[];
  orders: Order[];
  preferredSize: number | null;
  filters: Filters;
  swipe: (shoe: Shoe, dir: SwipeDir) => void;
  setPreferredSize: (size: number | null) => void;
  updateFilters: (newFilters: Partial<Filters>) => void;
  clearFilters: () => void;
  moveToCart: (id: string) => void;
  removeLiked: (id: string) => void;
  removeCart: (id: string) => void;
  clearCart: () => void;
  completeOrder: (order: Order) => void;
};

export const useStore = create<StoreState>(set => ({
  liked: [],
  cart: [],
  orders: [],
  preferredSize: null,
  filters: {
    size: null,
    brand: null,
    color: null,
    category: null,
    priceRange: null,
  },

  swipe: (shoe, dir) =>
    set(state => {
      const shoeWithSize = state.preferredSize 
        ? { ...shoe, selectedSize: state.preferredSize }
        : shoe;
      
      if (dir === 'right') return { liked: [...state.liked, shoeWithSize] };
      if (dir === 'up')    return { cart:  [...state.cart,  shoeWithSize] };
      return state; // left = discard
    }),

  setPreferredSize: (size) =>
    set({ preferredSize: size }),

  updateFilters: (newFilters) =>
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    })),

  clearFilters: () =>
    set({
      filters: {
        size: null,
        brand: null,
        color: null,
        category: null,
        priceRange: null,
      }
    }),

  moveToCart: id =>
    set(state => {
      const shoe = state.liked.find(s => s.id === id);
      if (!shoe) return state;
      return {
        liked: state.liked.filter(s => s.id !== id),
        cart:  [...state.cart, shoe],
      };
    }),

  removeLiked: id =>
    set(state => ({ liked: state.liked.filter(s => s.id !== id) })),

  removeCart: id =>
    set(state => ({ cart: state.cart.filter(s => s.id !== id) })),

  clearCart: () =>
    set({ cart: [] }),

  completeOrder: (order) =>
    set(state => ({ 
      orders: [...state.orders, order]
    })),
}));
