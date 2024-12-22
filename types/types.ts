export interface OrganizationCategory {
  id: number;
  category: string;
}

export interface Category {
  id: string;
  category: string;
}

export interface OrganizationSubCategory {
  id: string;
  sub_category: string;
  main_category_id: string;  // Changed from main_category to main_category_id to match DB
  created_at: string;
  categories: {  // This represents the joined categories table data
    id: string;
    category: string;
  };
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

