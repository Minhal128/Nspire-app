/**
 * Property Service
 * Handles all property-related API calls
 */

import api, { Property, PaginatedResponse } from './api';

export interface CreatePropertyData {
  propertyId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  buildings?: number;
  units?: number;
}

export interface UpdatePropertyData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  buildings?: number;
  units?: number;
  status?: string;
  inspectionCoverage?: string;
  calculatedUnits?: number;
  buildingDetails?: any[];
}

export interface PropertyFilters {
  search?: string;
  state?: string;
  city?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PropertyStats {
  totalProperties: number;
  totalBuildings: number;
  totalUnits: number;
  readyForInspection: number;
  compliant: number;
  nonCompliant: number;
}

class PropertyService {
  /**
   * Create a new property
   */
  async createProperty(data: CreatePropertyData): Promise<{ success: boolean; message: string; property: Property }> {
    try {
      const response = await api.post<{ success: boolean; message: string; property: Property }>('/properties', data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create property');
    }
  }

  /**
   * Create multiple properties in bulk
   */
  async createBulkProperties(properties: CreatePropertyData[]): Promise<{ success: boolean; message: string; properties: Property[]; errors?: any[] }> {
    try {
      const response = await api.post<{ success: boolean; message: string; properties: Property[]; errors?: any[] }>('/properties/bulk', { properties });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create properties in bulk');
    }
  }

  /**
   * Get all properties for the logged-in user
   */
  async getProperties(filters?: PropertyFilters): Promise<{ success: boolean; properties: Property[]; pagination: any }> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.state) params.append('state', filters.state);
        if (filters.city) params.append('city', filters.city);
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/properties?${queryString}` : '/properties';
      
      const response = await api.get<{ success: boolean; properties: Property[]; pagination: any }>(endpoint);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch properties');
    }
  }

  /**
   * Get a single property by ID
   */
  async getProperty(id: string): Promise<{ success: boolean; property: Property }> {
    try {
      const response = await api.get<{ success: boolean; property: Property }>(`/properties/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch property');
    }
  }

  /**
   * Update a property
   */
  async updateProperty(id: string, data: UpdatePropertyData): Promise<{ success: boolean; message: string; property: Property }> {
    try {
      const response = await api.put<{ success: boolean; message: string; property: Property }>(`/properties/${id}`, data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update property');
    }
  }

  /**
   * Delete a property
   */
  async deleteProperty(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/properties/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete property');
    }
  }

  /**
   * Delete multiple properties in bulk
   */
  async bulkDelete(propertyIds: string[]): Promise<{ success: boolean; message: string; deletedCount: number }> {
    try {
      const response = await api.post<{ success: boolean; message: string; deletedCount: number }>('/properties/bulk-delete', { propertyIds });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete properties');
    }
  }

  /**
   * Toggle hold status for a property's inspection
   */
  async hold(id: string): Promise<{ success: boolean; message: string; property: Property }> {
    try {
      const response = await api.patch<{ success: boolean; message: string; property: Property }>(`/properties/${id}/hold`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to hold inspection');
    }
  }

  /**
   * Get property statistics
   */
  async getPropertyStats(): Promise<{ success: boolean; stats: PropertyStats }> {
    try {
      const response = await api.get<{ success: boolean; stats: PropertyStats }>('/properties/stats');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch property stats');
    }
  }

  /**
   * Set property ready for inspection
   */
  async setReadyForInspection(id: string): Promise<{ success: boolean; message: string; property: Property }> {
    try {
      const response = await api.patch<{ success: boolean; message: string; property: Property }>(`/properties/${id}/ready`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to set property ready for inspection');
    }
  }

  /**
   * Get all properties (for management/supervisors)
   */
  async getAllProperties(filters?: PropertyFilters): Promise<{ success: boolean; properties: Property[]; pagination: any }> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.state) params.append('state', filters.state);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/properties/all?${queryString}` : '/properties/all';
      
      const response = await api.get<{ success: boolean; properties: Property[]; pagination: any }>(endpoint);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch all properties');
    }
  }
}

export const propertyService = new PropertyService();
export default propertyService;
