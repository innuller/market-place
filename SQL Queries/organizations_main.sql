create table public.organizations_main (
  id uuid not null default gen_random_uuid (),
  organization_name character varying(255) not null,
  email character varying(255) null,
  metadata jsonb null default '{}'::jsonb,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone null default CURRENT_TIMESTAMP,
  "user" uuid null default auth.uid (),
  is_verified boolean null default false,
  status character varying null default 'pending'::character varying,
  phone text null,
  address text null,
  website text null,
  constraint organizations_main_pkey primary key (id),
  constraint organizations_main_email_key unique (email),
  constraint organizations_main_user_key unique ("user"),
  constraint organizations_main_user_fkey foreign KEY ("user") references "user" (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- Here How Data is stored in this table
{
  "is_msme": false,
  "website": "https://www.nfsu.com",
  "bank_name": "State Bank of India ",
  "hsn_codes": [
    {
      "code": "HSN1",
      "description": "HSN1 Desc"
    },
    {
      "code": "HSN2",
      "description": "HSN2 Desc"
    }
  ],
  "categories": "f7fca527-daa9-43a1-80dd-4b183271cf88",
  "cin_number": "48798465",
  "gst_number": "1012145987",
  "pan_number": "CBBP45657",
  "child_labor": false,
  "departments": [
    "Marketing",
    "Sales",
    "Project",
    "Quality/Inspection"
  ],
  "forced_labor": false,
  "legal_status": [
    "Sole Proprietorship",
    "Partnership"
  ],
  "current_ratio": "8",
  "director_name": "Director Name Test",
  "plant_address": "Bruce Street 3",
  "plant_pincode": "103334",
  "contact_number": "09987541202",
  "director_email": "wayne.b@bw.com",
  "forecast_ebita": "54654",
  "major_projects": [
    {
      "name": "Forensic",
      "location": "India",
      "end_customer": "Govt"
    }
  ],
  "office_address": "Bruce Street 3",
  "office_pincode": "103334",
  "sub_categories": [
    "Android",
    "Web3"
  ],
  "annual_turnover": "87987",
  "logistic_access": [
    "LAND_ROAD",
    "MOTORWAY",
    "AIRPORT"
  ],
  "major_customers": [
    {
      "name": "Wayne",
      "location": "America",
      "business_percentage": 45
    }
  ],
  "management_name": "Managment Name Test",
  "max_floor_space": 100,
  "office_end_time": "09:14",
  "total_employees": "50-100",
  "management_email": "wayne.b@bw.com",
  "manpower_details": {
    "Engineers": "10",
    "Welders/Fitters": "10",
    "Unskilled Labour": "10",
    "Skilled Operators": "10",
    "Separate Quality Inspectors": "10"
  },
  "terms_conditions": false,
  "export_experience": false,
  "hse_overseer_info": "HSE Reni",
  "office_start_time": "21:14",
  "products_services": [
    {
      "name": "Education",
      "catalog": "https://dxiavfaaitjbuadmsbbr.supabase.co/storage/v1/object/public/catalogs/0.6069487375418599.png"
    },
    {
      "name": "Forensic",
      "catalog": "https://dxiavfaaitjbuadmsbbr.supabase.co/storage/v1/object/public/catalogs/0.46715479916085045.png"
    }
  ],
  "has_documented_qms": false,
  "inventory_turnover": "54654656546",
  "non_discrimination": false,
  "wages_and_benefits": false,
  "bank_branch_address": "Bruce Street 3",
  "major_sub_suppliers": [
    {
      "name": "Sub1",
      "location": "Delhi",
      "sourcing_percentage": 18
    }
  ],
  "compliance_standards": [
    "ISO 45001:2018",
    "ISO 50001:2018"
  ],
  "experience_with_epcs": [
    "Technip",
    "Sabic",
    "Aramco"
  ],
  "has_been_blacklisted": false,
  "currency_transactions": [
    "YEN",
    "USD",
    "EURO",
    "INR"
  ],
  "distance_from_seaport": 37,
  "emergency_person_name": "Wayne",
  "is_part_of_larger_org": false,
  "standard_organization": "JIS",
  "year_of_incorporation": 2000,
  "emergency_person_email": "wayne.b@bw.com",
  "gst_registration_state": "NY",
  "has_engaged_consultant": false,
  "received_legal_notices": false,
  "data_security_practices": false,
  "director_contact_number": "09987541202",
  "has_drugs_alcohol_policy": false,
  "has_emergency_procedures": false,
  "has_documented_procedures": false,
  "management_contact_number": "09987541202",
  "turnover_last_three_years": [
    {
      "year": "2023-2024",
      "turnover": "45646564"
    },
    {
      "year": "2024-2025",
      "turnover": "4565465"
    },
    {
      "year": "2025-2026",
      "turnover": "1654679"
    }
  ],
  "has_documented_hsse_system": false,
  "import_export_restrictions": false,
  "other_experience_with_epcs": null,
  "has_emergency_response_team": false,
  "other_currency_transactions": null,
  "other_standard_organization": null,
  "workers_inducted_and_trained": false,
  "maintains_hse_incident_reports": false,
  "emergency_person_contact_number": "09987541202",
  "has_completed_management_review": false,
  "identifies_hazards_and_controls": false,
  "is_manufacturing_facility_owned": false,
  "is_hse_management_system_certified": false,
  "is_quality_system_documentation_available": false
}