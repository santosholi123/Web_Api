import axiosInstance from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

/**
 * Admin Actions
 * Placeholder for admin-specific API calls
 * These will be called from admin pages/components
 */

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  try {
    // const response = await axiosInstance.get("/admin/users");
    // return response.data;

    // Mock response
    return {
      users: [],
      total: 0,
    };
  } catch (error) {
    console.error("Failed to get users:", error);
    throw error;
  }
}

/**
 * Get all products (admin)
 */
export async function getAllProducts() {
  try {
    // const response = await axiosInstance.get(ENDPOINTS.PRODUCTS.LIST);
    // return response.data;

    // Mock response
    return {
      products: [],
      total: 0,
    };
  } catch (error) {
    console.error("Failed to get products:", error);
    throw error;
  }
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(userId: string) {
  try {
    // await axiosInstance.delete(`/admin/users/${userId}`);
    // return { success: true };

    // Mock response
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}
