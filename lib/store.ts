// lib/store.ts
import { create } from 'zustand';

export type Shoe = {
  id: string;
  brand: string;
  model: string;
  price: number;
  image: number;     // static require(...)
};

type SwipeDir = 'left' | 'right' | 'up';

type StoreState = {
  liked: Shoe[];
  cart: Shoe[];
  swipe: (shoe: Shoe, dir: SwipeDir) => void;
  moveToCart: (id: string) => void;
  removeLiked: (id: string) => void;
  removeCart: (id: string) => void;
};

export const useStore = create<StoreState>(set => ({
  liked: [],
  cart: [],

  swipe: (shoe, dir) =>
    set(state => {
      if (dir === 'right') return { liked: [...state.liked, shoe] };
      if (dir === 'up')    return { cart:  [...state.cart,  shoe] };
      return state; // left = discard
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
}));
