import { api } from "@/lib/api";
import { 
  MembersData, 
  MembersFilters, 
  MembersOnboardCredentials,
  MemberOverviewStats,
  ImportMembersResponse,
  UpdateMemberCredentials
} from "@/types/members.types";

export class MembersService {
  private static readonly BASE_URL = "/members";

  /**
   * Create a new member
   * POST /members
   */
  static async createMember(credentials: MembersOnboardCredentials) {
    return await api.post<MembersData>(this.BASE_URL, credentials);
  }

  /**
   * Get all members with pagination, search, and filters
   * GET /members
   */
  static async getMembers(filters?: MembersFilters) {
    return await api.get<MembersData[]>(this.BASE_URL, { params: filters });
  }

  /**
   * Get member overview statistics
   * GET /members/overview
   */
  static async getOverview() {
    return await api.get<MemberOverviewStats>(`${this.BASE_URL}/overview`);
  }

  /**
   * Get a single member by ID
   * GET /members/{id}
   */
  static async getMember(memberId: string) {
    return await api.get<MembersData>(`${this.BASE_URL}/${memberId}`);
  }

  /**
   * Update a member
   * PATCH /members/{id}
   */
  static async updateMember(memberId: string, credentials: UpdateMemberCredentials) {
    return await api.patch<MembersData>(`${this.BASE_URL}/${memberId}`, credentials);
  }

  /**
   * Delete a member (superadmin only)
   * DELETE /members/{id}
   */
  static async deleteMember(memberId: string) {
    return await api.delete(`${this.BASE_URL}/${memberId}`);
  }

  /**
   * Import members from CSV file
   * POST /members/import
   */
  static async importMembers(fileBase64: string, filename: string) {
    return await api.post<ImportMembersResponse>(`${this.BASE_URL}/import`, {
      fileBase64,
      filename
    });
  }

  /**
   * Export members to CSV file
   * GET /members/export/csv
   * Note: This returns a blob for file download
   */
  static async exportMembers(filters?: MembersFilters) {
    return await api.get<Blob>(`${this.BASE_URL}/export/csv`, { 
      params: filters,
      // Override response type to handle blob
      headers: { Accept: "text/csv" }
    });
  }
}