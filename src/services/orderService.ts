/**
 * Order Service
 * Handles all order-related API calls
 */

import api, { Order } from './api';

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderData {
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: OrderItem[];
  notes?: string;
  paymentMethod?: string;
}

export interface UpdateOrderData {
  status?: string;
  paymentStatus?: string;
  notes?: string;
  assignedTo?: string;
  deliveryDate?: string;
}

export interface OrderFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  shippedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  completedToday: number;
}

class OrderService {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderData): Promise<{ success: boolean; message: string; order: Order }> {
    try {
      const response = await api.post<{ success: boolean; message: string; order: Order }>('/orders', data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create order');
    }
  }

  /**
   * Get all orders for the logged-in user
   */
  async getOrders(filters?: OrderFilters): Promise<{ success: boolean; orders: Order[]; pagination: any }> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/orders?${queryString}` : '/orders';
      
      const response = await api.get<{ success: boolean; orders: Order[]; pagination: any }>(endpoint);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  }

  /**
   * Get a single order by ID
   */
  async getOrder(id: string): Promise<{ success: boolean; order: Order }> {
    try {
      const response = await api.get<{ success: boolean; order: Order }>(`/orders/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch order');
    }
  }

  /**
   * Update an order
   */
  async updateOrder(id: string, data: UpdateOrderData): Promise<{ success: boolean; message: string; order: Order }> {
    try {
      const response = await api.put<{ success: boolean; message: string; order: Order }>(`/orders/${id}`, data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update order');
    }
  }

  /**
   * Delete an order
   */
  async deleteOrder(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/orders/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete order');
    }
  }

  /**
   * Get order statistics
   */
  async getOrderStats(): Promise<{ success: boolean; stats: OrderStats }> {
    try {
      const response = await api.get<{ success: boolean; stats: OrderStats }>('/orders/stats');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch order stats');
    }
  }
}

export const orderService = new OrderService();
export default orderService;
