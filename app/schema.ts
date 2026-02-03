/**
 * Schema/Type Definitions
 * Centralized place for shared TypeScript types
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  id: string;
  title: string;
  category: "homogeneous" | "heterogeneous" | "sports";
  image: string;
  description?: string;
  price?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
