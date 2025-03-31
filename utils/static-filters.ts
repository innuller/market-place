// Static filters configuration

export const staticFilters = {
  major_projects: [
    {
      name: "Hotel",
      location: "USA",
      end_customer: "Customers"
    },
    {
      name: "Tech",
      location: "Pak",
      end_customer: "India"
    }
  ],

  hsn_codes: [
    {
      code: "HSN1",
      description: "HSN1 Desc"
    },
    {
      code: "HSN2",
      description: "HSN2 Desc"
    }
  ],

  major_customers: [
    {
      name: "Wayne",
      location: "America",
      business_percentage: 45
    },
    {
      name: "Wayne2",
      location: "India",
      business_percentage: 50
    }
  ],

  major_sub_suppliers: [
    {
      name: "Sub1",
      location: "Delhi",
      sourcing_percentage: 18
    },
    {
      name: "Sub2",
      location: "Rohini",
      sourcing_percentage: 20
    }
  ]
};

// Filter configurations for the FilterPanel component
export const filterConfigurations = [
  {
    id: 'major_projects',
    name: 'Major Projects',
    field: 'major_projects',
    type: 'object',
    subFilters: [
      {
        id: 'project_name',
        name: 'Project Name',
        field: 'name',
        type: 'array',
        options: staticFilters.major_projects.map(p => p.name)
      },
      {
        id: 'project_location',
        name: 'Location',
        field: 'location',
        type: 'array',
        options: Array.from(new Set(staticFilters.major_projects.map(p => p.location)))
      },
      {
        id: 'end_customer',
        name: 'End Customer',
        field: 'end_customer',
        type: 'array',
        options: Array.from(new Set(staticFilters.major_projects.map(p => p.end_customer)))
      }
    ]
  },
  {
    id: 'hsn_codes',
    name: 'HSN Codes',
    field: 'hsn_codes',
    type: 'object',
    subFilters: [
      {
        id: 'hsn_code',
        name: 'Code',
        field: 'code',
        type: 'array',
        options: staticFilters.hsn_codes.map(h => h.code)
      },
      {
        id: 'hsn_description',
        name: 'Description',
        field: 'description',
        type: 'array',
        options: staticFilters.hsn_codes.map(h => h.description)
      }
    ]
  },
  {
    id: 'major_customers',
    name: 'Major Customers',
    field: 'major_customers',
    type: 'object',
    subFilters: [
      {
        id: 'customer_name',
        name: 'Customer Name',
        field: 'name',
        type: 'array',
        options: staticFilters.major_customers.map(c => c.name)
      },
      {
        id: 'customer_location',
        name: 'Location',
        field: 'location',
        type: 'array',
        options: Array.from(new Set(staticFilters.major_customers.map(c => c.location)))
      },
      {
        id: 'business_percentage',
        name: 'Business Percentage',
        field: 'business_percentage',
        type: 'number',
        min: 0,
        max: 100,
        step: 1
      }
    ]
  },
  {
    id: 'major_sub_suppliers',
    name: 'Major Sub Suppliers',
    field: 'major_sub_suppliers',
    type: 'object',
    subFilters: [
      {
        id: 'supplier_name',
        name: 'Supplier Name',
        field: 'name',
        type: 'array',
        options: staticFilters.major_sub_suppliers.map(s => s.name)
      },
      {
        id: 'supplier_location',
        name: 'Location',
        field: 'location',
        type: 'array',
        options: Array.from(new Set(staticFilters.major_sub_suppliers.map(s => s.location)))
      },
      {
        id: 'sourcing_percentage',
        name: 'Sourcing Percentage',
        field: 'sourcing_percentage',
        type: 'number',
        min: 0,
        max: 100,
        step: 1
      }
    ]
  }
];