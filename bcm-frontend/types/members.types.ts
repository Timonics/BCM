export interface MembersData {
  id: string;
  memberCode: string;
  firstName: string;
  middleName: string;
  surname: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  age: number;
  maritalStatus: string;
  stateOfOrigin: string;
  country: string;
  residentialState: string;
  city: string;
  lga: string;
  occupation: string;
  addressLine: string;
  membershipPath: string;
  suspensionStatus: "active" | "suspended" | "overgrown";
  createdAt: string;
  updatedAt: string;
}

export interface MemberOverviewStats {
  totalMembers: number;
  active: number;
  overgrown: number;
  suspended: number;
}

export interface AcademicRecord {
  institution: string;
  courseProgram: string;
  qualification: string;
  startDate: string;
  endDate: string;
}

export interface MembersOnboardCredentials {
  memberCode: string;
  firstName: string;
  middleName: string;
  surname: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  maritalStatus: string;
  stateOfOrigin: string;
  country: string;
  residentialState: string;
  city: string;
  lga: string;
  occupation?: string;
  addressLine: string;
  membershipPath: string;
  baptismStatus: string;
  bandId: string;
  unitIds: string[];
  enrollPreYouth: boolean;
  enrollBaptismal: boolean;
  enrollETS: boolean;
  classBatchIds: string[];
  academics: AcademicRecord[];
  placeOfWork: string;
  officeAddress: string;
}

export type UpdateMemberCredentials = Partial<MembersOnboardCredentials>;

export interface MembersFilters {
  search?: string;
  gender?: string;
  bandId?: string;
  unitId?: string;
  classBatchId?: string;
  status?: string;
  limit?: number;
  page?: number;
}

export interface ImportMembersResponse {
  success: number;
  failed: number;
  errors: string[];
}
