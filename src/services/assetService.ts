/**
 * Asset Service
 * Handles all asset-related API calls
 */

import api, { Asset } from './api';

export interface MaintenanceRecord {
  date: string;
  type: string;
  description: string;
  cost?: number;
  performedBy?: string;
}

export interface CreateAssetData {
  name: string;
  category: string;
  description?: string;
  location: string;
  value?: number;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiry?: string;
  status?: string;
  condition?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  maintenanceSchedule?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateAssetData {
  name?: string;
  category?: string;
  description?: string;
  location?: string;
  value?: number;
  status?: string;
  condition?: string;
  notes?: string;
  tags?: string[];
}

export interface AssetFilters {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AssetStats {
  totalAssets: number;
  activeAssets: number;
  maintenanceAssets: number;
  inactiveAssets: number;
  totalValue: number;
  categoryCounts: { [key: string]: number };
}

class AssetService {
  /**
   * Create a new asset
   */
  async createAsset(data: CreateAssetData): Promise<{ success: boolean; message: string; asset: Asset }> {
    try {
      const response = await api.post<{ success: boolean; message: string; asset: Asset }>('/assets', data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create asset');
    }
  }

  /**
   * Get all assets for the logged-in user
   */
  async getAssets(filters?: AssetFilters): Promise<{ success: boolean; assets: Asset[]; pagination: any }> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/assets?${queryString}` : '/assets';
      
      const response = await api.get<{ success: boolean; assets: Asset[]; pagination: any }>(endpoint);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch assets');
    }
  }

  /**
   * Get a single asset by ID
   */
  async getAsset(id: string): Promise<{ success: boolean; asset: Asset }> {
    try {
      const response = await api.get<{ success: boolean; asset: Asset }>(`/assets/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch asset');
    }
  }

  /**
   * Update an asset
   */
  async updateAsset(id: string, data: UpdateAssetData): Promise<{ success: boolean; message: string; asset: Asset }> {
    try {
      const response = await api.put<{ success: boolean; message: string; asset: Asset }>(`/assets/${id}`, data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update asset');
    }
  }

  /**
   * Delete an asset
   */
  async deleteAsset(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/assets/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete asset');
    }
  }

  /**
   * Get asset statistics
   */
  async getAssetStats(): Promise<{ success: boolean; stats: AssetStats }> {
    try {
      const response = await api.get<{ success: boolean; stats: AssetStats }>('/assets/stats');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch asset stats');
    }
  }

  /**
   * Add maintenance record to an asset
   */
  async addMaintenanceRecord(id: string, record: MaintenanceRecord): Promise<{ success: boolean; message: string; asset: Asset }> {
    try {
      const response = await api.post<{ success: boolean; message: string; asset: Asset }>(`/assets/${id}/maintenance`, record);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add maintenance record');
    }
  }
}

export const assetService = new AssetService();
export default assetService;
