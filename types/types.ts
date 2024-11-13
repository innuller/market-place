export interface OrganizationCategory {
  id: number;
  category: string;
}

export interface OrganizationSubCategory {
  id: number;
  sub_category: string;
}

export interface ComplianceStandard {
  id: number;
  standard: string;
}

export interface Organization {
  id: string;
  organization_name: string;
  email: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved' | 'rejected';
}