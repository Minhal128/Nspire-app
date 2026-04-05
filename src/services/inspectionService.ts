/**
 * Inspection Service
 * Handles all inspection-related API calls
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { Inspection, API_CONFIG } from './api';
import { StorageKeys } from '../utils/storage';

export interface CreateInspectionData {
  property: string;
  building?: string;
  unit?: string;
  inspectionType?: string;
  inspectionLevel?: string;
  scheduledDate: string;
  purpose?: string;
  hudPreNegative?: string;
  managementCompany?: string;
  insuranceCompany?: string;
  banker?: string;
  notes?: string;
}

export interface CreateInspectionRequestData {
  purpose: string;
  buildings: number;
  units: number;
  state: string;
  zipCode: string;
  hudPreNegative?: string;
  managementCompany?: string;
  insuranceCompany?: string;
  banker?: string;
}

export interface UpdateInspectionData {
  scheduledDate?: string;
  status?: string;
  complianceScore?: number;
  findings?: any[];
  notes?: string;
}

export interface InspectionFilters {
  status?: string;
  property?: string;
  page?: number;
  limit?: number;
}

export interface InspectionStats {
  totalInspections: number;
  completed: number;
  pending: number;
  inProgress: number;
  scheduled: number;
  compliant: number;
  nonCompliant: number;
  averageScore: number;
}

export interface InspectionRequest {
  _id: string;
  requestId: string;
  purpose: string;
  buildings: number;
  units: number;
  state: string;
  zipCode: string;
  status: string;
  requestedBy: string;
  createdAt: string;
}

export interface SaveProgressPayload {
  property_id: string;
  unit_id: string;
  inspection_type: string;
  responses?: Record<string, any>;
  inspectionData?: any;
}

export interface GetProgressPayload {
  property_id: string;
  unit_id: string;
  inspection_type: string;
}

export interface GetUnitInspectionStatusPayload {
  property_id: string;
  building_id: string;
}

export interface UnitInspectionStatusResponse {
  success: boolean;
  propertyId?: string;
  buildingId?: string;
  statuses: Array<{
    unitLabel: string;
    normalizedUnitKey: string;
    isInspected: boolean;
    inspectedAt?: string;
    sourceInspectionType?: string;
  }>;
  unitStatusMap: Record<string, boolean>;
}

class InspectionService {
  /**
   * Create a new inspection
   */
  async createInspection(data: CreateInspectionData): Promise<{ success: boolean; message: string; inspection: Inspection }> {
    try {
      const response = await api.post<{ success: boolean; message: string; inspection: Inspection }>('/inspections', data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create inspection');
    }
  }

  /**
   * Get all inspections for the logged-in user
   */
  async getInspections(filters?: InspectionFilters): Promise<{ success: boolean; inspections: Inspection[]; pagination: any }> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.property) params.append('property', filters.property);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/inspections?${queryString}` : '/inspections';

      console.log('Fetching inspections from endpoint:', endpoint);
      const response = await api.get<{ success: boolean; inspections: Inspection[]; pagination: any }>(endpoint);
      console.log('Inspections response:', JSON.stringify(response).substring(0, 200));
      return response;
    } catch (error: any) {
      console.error('Error in getInspections:', error.message);
      // Return empty data on error (e.g., auth issues) instead of throwing
      return { success: false, inspections: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
  }

  /**
   * Get all inspection progress drafts for the current inspector
   */
  async getAllProgress(options?: {
    propertyId?: string;
    timeoutMs?: number;
    draftOnly?: boolean;
    inspectionTypePrefix?: string;
    includeProperty?: boolean;
  }): Promise<{ success: boolean; progress: any[] }> {
    try {
      const storedToken = await AsyncStorage.getItem(StorageKeys.USER_TOKEN);
      let token: string | null = null;

      if (storedToken) {
        try {
          token = JSON.parse(storedToken);
        } catch {
          token = storedToken;
        }
      }

      const timeoutMs = Math.min(Math.max(options?.timeoutMs ?? 15000, 5000), 90000);
      const queryParams = new URLSearchParams();

      if (options?.propertyId) {
        queryParams.append('property_id', options.propertyId);
      }

      if (options?.draftOnly) {
        queryParams.append('draft_only', 'true');
      }

      if (options?.inspectionTypePrefix) {
        queryParams.append('inspection_type_prefix', options.inspectionTypePrefix);
      }

      if (options?.includeProperty) {
        queryParams.append('include_property', 'true');
      }

      const queryString = queryParams.toString();
      const endpoint = `${API_CONFIG.BASE_URL}/inspections/progress${queryString ? `?${queryString}` : ''}`;

      const fetchProgressWithTimeout = async (requestTimeoutMs: number) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            signal: controller.signal,
          });

          const responseText = await response.text();
          let data: any = {};
          try {
            data = responseText ? JSON.parse(responseText) : {};
          } catch {
            data = {};
          }

          if (!response.ok) {
            throw new Error(data?.message || `HTTP ${response.status}`);
          }

          return {
            success: !!data?.success,
            progress: Array.isArray(data?.progress) ? data.progress : [],
          };
        } finally {
          clearTimeout(timeoutId);
        }
      };

      const isAbortLikeError = (error: any) => {
        const errorName = String(error?.name || '').toLowerCase();
        const errorMessage = String(error?.message || '').toLowerCase();
        return errorName.includes('abort') || errorMessage.includes('abort');
      };

      try {
        return await fetchProgressWithTimeout(timeoutMs);
      } catch (primaryError: any) {
        if (isAbortLikeError(primaryError) && timeoutMs < 45000) {
          console.warn(`Progress fetch timed out at ${timeoutMs}ms, retrying once with a longer timeout...`);
          return await fetchProgressWithTimeout(45000);
        }

        throw primaryError;
      }
    } catch (error: any) {
      console.error('Error fetching all progress:', error.message);
      return { success: false, progress: [] };
    }
  }

  /**
   * Get backend-managed inspected unit flags for a property/building
   */
  async getUnitInspectionStatus(
    params: GetUnitInspectionStatusPayload
  ): Promise<UnitInspectionStatusResponse> {
    try {
      const query = new URLSearchParams({
        property_id: params.property_id,
        building_id: params.building_id,
      }).toString();

      const response = await api.get<UnitInspectionStatusResponse>(`/inspections/unit-status?${query}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching unit inspection status:', error.message);
      return {
        success: false,
        statuses: [],
        unitStatusMap: {},
      };
    }
  }

  /**
   * Save progress for a specific property/unit/type
   */
  async saveProgress(payload: SaveProgressPayload): Promise<{ success: boolean; msg?: string }> {
    try {
      const response = await api.put<{ success: boolean; msg?: string }>('/inspections/progress', payload);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to save progress');
    }
  }

  /**
   * Get progress for a specific property/unit/type
   */
  async getProgress(params: GetProgressPayload): Promise<{ items: Record<string, any>; inspectionData?: any }> {
    try {
      const query = new URLSearchParams({
        property_id: params.property_id,
        unit_id: params.unit_id,
        inspection_type: params.inspection_type,
      }).toString();

      const response = await api.get<{ items: Record<string, any>; inspectionData?: any }>(`/inspections/progress?${query}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch progress');
    }
  }

  /**
   * Get all inspections across the system (for management portal)
   */
  async getAllInspections(filters?: InspectionFilters): Promise<{ success: boolean; inspections: Inspection[]; pagination: any }> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.property) params.append('property', filters.property);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/admin/inspections?${queryString}` : '/admin/inspections';

      console.log('Fetching all inspections from endpoint:', endpoint);
      const response = await api.get<{ success: boolean; inspections: Inspection[]; pagination: any }>(endpoint);
      console.log('All inspections response:', JSON.stringify(response).substring(0, 200));
      return response;
    } catch (error: any) {
      console.error('Error in getAllInspections:', error.message);
      // Return empty data on error (e.g., auth issues) instead of throwing
      return { success: false, inspections: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
  }

  /**
   * Get a single inspection by ID
   */
  async getInspection(id: string): Promise<{ success: boolean; inspection: Inspection }> {
    try {
      const response = await api.get<{ success: boolean; inspection: Inspection }>(`/inspections/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch inspection');
    }
  }

  /**
   * Update an inspection
   */
  async updateInspection(id: string, data: UpdateInspectionData): Promise<{ success: boolean; message: string; inspection: Inspection }> {
    try {
      const response = await api.put<{ success: boolean; message: string; inspection: Inspection }>(`/inspections/${id}`, data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update inspection');
    }
  }

  /**
   * Complete an inspection
   */
  async completeInspection(id: string, data: { complianceScore: number; findings?: any[]; notes?: string }): Promise<{ success: boolean; message: string; inspection: Inspection }> {
    try {
      // Map to backend expected fields
      const payload = {
        score: data.complianceScore,
        complianceScore: data.complianceScore,
        deficiencies: data.findings,
        findings: data.findings,
        notes: data.notes,
        result: data.complianceScore >= 70 ? 'compliant' : 'non-compliant',
      };
      const response = await api.patch<{ success: boolean; message: string; inspection: Inspection }>(`/inspections/${id}/complete`, payload);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete inspection');
    }
  }

  /**
   * Delete an inspection
   */
  async deleteInspection(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/inspections/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete inspection');
    }
  }

  /**
   * Get inspection statistics
   */
  async getInspectionStats(): Promise<{ success: boolean; stats: InspectionStats }> {
    try {
      const response = await api.get<{ success: boolean; stats: InspectionStats }>('/inspections/stats');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch inspection stats');
    }
  }

  /**
   * Create an inspection request
   */
  async createInspectionRequest(data: CreateInspectionRequestData): Promise<{ success: boolean; message: string; request: InspectionRequest }> {
    try {
      const response = await api.post<{ success: boolean; message: string; request: InspectionRequest }>('/inspections/request', data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create inspection request');
    }
  }

  /**
   * Get all inspection requests
   */
  async getInspectionRequests(): Promise<{ success: boolean; requests: InspectionRequest[] }> {
    try {
      const response = await api.get<{ success: boolean; requests: InspectionRequest[] }>('/inspections/requests');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch inspection requests');
    }
  }
}

export const inspectionService = new InspectionService();
export default inspectionService;
