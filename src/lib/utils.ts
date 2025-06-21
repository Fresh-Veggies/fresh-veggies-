import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { User, CartItem, Order } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// LocalStorage utilities
export const STORAGE_KEYS = {
  USER: 'freshVeggies_user',
  CART: 'freshVeggies_cart',
  ORDERS: 'freshVeggies_orders',
  AUTH_STATE: 'freshVeggies_authState',
} as const;

export const localStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: unknown) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

// User management
export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.USER, user);
};

export const getUser = (): User | null => {
  return localStorage.getItem(STORAGE_KEYS.USER);
};

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Cart management
export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(STORAGE_KEYS.CART, cart);
};

export const getCart = (): CartItem[] => {
  return localStorage.getItem(STORAGE_KEYS.CART) || [];
};

export const clearCart = () => {
  localStorage.removeItem(STORAGE_KEYS.CART);
};

// Orders management
export const saveOrder = (order: Order) => {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(STORAGE_KEYS.ORDERS, orders);
};

export const getOrders = (): Order[] => {
  return localStorage.getItem(STORAGE_KEYS.ORDERS) || [];
};

// Utility functions
export const formatPrice = (price: number): string => {
  return `₹${price.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateTax = (subtotal: number, taxRate: number = 0.05): number => {
  return subtotal * taxRate;
};

export const generateOrderId = (): string => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
}; 