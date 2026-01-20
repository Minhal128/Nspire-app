/**
 * Inspection Service
 * Handles all inspection-related API calls
 */

import api, { Inspection } from './api';

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
