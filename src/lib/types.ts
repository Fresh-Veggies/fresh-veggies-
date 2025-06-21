export interface Product {
  id: string;
  name: string;
  image: string;
  pricePerKg: number;
  category: string;
  description: string;
  inStock: boolean;
  minOrder: number;
  maxOrder: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address?: Address;
}

export interface Address {
  fullName: string;
  mobile: string;
  email: string;
  street: string;
  city: string;
  pincode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: Address;
  status: 'In Progress' | 'Delivered';
  orderDate: string;
  taxes: number;
  subtotal: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
} 