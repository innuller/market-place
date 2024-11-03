'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation"

const categories = [
  "Manufacturing",
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Education",
]

const legalStatuses = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation",
  "Non-Profit Organization",
]

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const employeeRanges = [
  "1-49",
  "50-100",
  "101-250",
  "251-1000",
  "1001-2000",
  "2001+",
]

const departments = [
  "Marketing",
  "Sales",
  "Engineering",
  "Planning",
  "Project",
  "Quality/Inspection",
  "Production",
  "Dispatch & Logistics",
  "Research & Development",
  "IT & Admin",
  "Human Resource",
  "Finance",
  "Legal",
]

const manpowerCategories = [
  "Engineers",
  "Skilled Operators",
  "Welders/Fitters",
  "Unskilled Labour",
  "Separate Quality Inspectors",
]

const standardOrganizations = [
  "ASME",
  "EN",
  "JIS",
  "GOST",
  "Other",
]

const complianceStandards = [
  "ISO 9001:2015",
  "ISO 14001:2015",
  "ISO 45001:2018",
  "ISO 50001:2018",
  "ISO 27001:2013",
  "ISO 17025",
  "OHSAS 18001",
  "EN 1090-1",
  "Machine directive 2006/42/EC",
  "ISO 9100:2016",
  "Other",
]

const reputedEPCs = [
  "EIL",
  "Toyo",
  "Technip",
  "Thyssenkrupp",
  "Tecnimont",
  "Sabic",
  "Aramco",
]

const currencyOptions = [
  { value: "INR", label: "INR" },
  { value: "EURO", label: "EURO" },
  { value: "USD", label: "USD" },
  { value: "YEN", label: "YEN" },
  { value: "RMB", label: "RMB" },
  { value: "OTHER", label: "Other" },
]

const logisticOptions = [
  { value: "LAND_ROAD", label: "Land Road" },
  { value: "MOTORWAY", label: "Motorway" },
  { value: "RAILWAY", label: "Railway" },
  { value: "RIVERPORT", label: "Riverport" },
  { value: "AIRPORT", label: "Airport" },
  { value: "SEAPORT", label: "Seaport" },
]



const formSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  categories: z.array(z.string()).min(1, {
    message: "Please select at least one category.",
  }),
  subCategories: z.array(z.string()).min(1, {
    message: "Please select at least one sub-category.",
  }),
  officeAddress: z.string().min(10, {
    message: "Office address must be at least 10 characters.",
  }),
  officePincode: z.string().regex(/^\d{6}$/, {
    message: "Pincode must be 6 digits.",
  }),
  plantAddress: z.string().min(10, {
    message: "Plant address must be at least 10 characters.",
  }),
  plantPincode: z.string().regex(/^\d{6}$/, {
    message: "Pincode must be 6 digits.",
  }),
  officeStartTime: z.string(),
  officeEndTime: z.string(),
  offDays: z.array(z.string()),
  maxFloorSpace: z.string().min(1, {
    message: "Please enter the maximum floor space.",
  }),
  legalStatus: z.array(z.string()).min(1, {
    message: "Please select at least one legal status.",
  }),
  isPartOfLargerOrg: z.enum(["yes", "no"]),
  largerOrgName: z.string().optional(),
  yearOfIncorporation: z.string(),
  gstNumber: z.string().optional(),
  gstRegistrationState: z.string().optional(),
  esiRegistrationNumber: z.string().optional(),
  pfRegistrationNumber: z.string().optional(),
  dunsNumber: z.string().optional(),
  isMSME: z.enum(["yes", "no"]),
  msmeAttachment: z.any().optional(),
  panNumber: z.string(),
  cinNumber: z.string(),
  website: z.string().url({ message: "Please enter a valid URL" }),
  contactNumber: z.string(),
  fax: z.string().optional(),
  directorName: z.string(),
  directorEmail: z.string().email({
    message: "Please enter a valid email address for the director.",
  }),
  directorContactNumber: z.string(),
  managementName: z.string(),
  managementEmail: z.string().email({
    message: "Please enter a valid email address for the management.",
  }),
  managementContactNumber: z.string(),
  emergencyPersonName: z.string(),
  emergencyPersonEmail: z.string().email({
    message: "Please enter a valid email address for the emergency contact.",
  }),
  emergencyPersonContactNumber: z.string(),
  totalEmployees: z.string(),
  departments: z.array(z.string()).min(1, {
    message: "Please select at least one department.",
  }),
  manpowerDetails: z.record(z.string(), z.string().regex(/^\d+$/, {
    message: "Please enter a valid number.",
  })),
  productsServices: z.array(z.object({
    name: z.string().min(1, { message: "Product/Service name is required" }),
    catalog: z.any().optional(),
  })).min(1, { message: "Please add at least one product or service" }),
  standardOrganization: z.string(),
  otherStandardOrganization: z.string().optional(),
  complianceStandards: z.array(z.string()),
  otherComplianceStandard: z.string().optional(),
  hsnCodes: z.array(z.object({
    code: z.string().min(1, { message: "HSN Code is required" }),
    description: z.string().min(1, { message: "Description is required" }),
  })),
  hasDocumentedProcedures: z.enum(["yes", "no"]),
  experienceWithEPCs: z.array(z.string()),
  majorCustomers: z.array(z.object({
    name: z.string().min(1, { message: "Customer name is required" }),
    location: z.string().min(1, { message: "Customer location is required" }),
    businessPercentage: z.number().min(0).max(100, { message: "Percentage must be between 0 and 100" }),
  })),
  majorSubSuppliers: z.array(z.object({
    name: z.string().min(1, { message: "Sub-supplier name is required" }),
    location: z.string().min(1, { message: "Sub-supplier location is required" }),
    sourcingPercentage: z.number().min(0).max(100, { message: "Percentage must be between 0 and 100" }),
  })),
  majorProjects: z.array(z.object({
    name: z.string().min(1, { message: "Project name is required" }),
    location: z.string().min(1, { message: "Project location is required" }),
    endCustomer: z.string().min(1, { message: "End customer is required" }),
  })),
  hasBeenBlacklisted: z.enum(["yes", "no"]),
  blacklistingDocument: z.any().optional(),
  hasEngagedConsultant: z.enum(["yes", "no"]),
  consultantName: z.string().optional(),
  consultancyFirmName: z.string().optional(),
  hasDocumentedQMS: z.enum(["yes", "no"]),
  qmsCertificationStructure: z.enum(["single", "multi"]).optional(),
  isQualitySystemDocumentationAvailable: z.enum(["yes", "no"]),
  hasCompletedManagementReview: z.enum(["yes", "no"]),
  surveillanceAuditFrequency: z.enum(["annual", "sixMonth"]).optional(),
  hasDocumentedHSSESystem: z.enum(["yes", "no"]),
  isHSEManagementSystemCertified: z.enum(["yes", "no"]).optional(),
  hseOverseerInfo: z.string().min(1, { message: "HSE overseer information is required" }),
  hasDrugsAlcoholPolicy: z.enum(["yes", "no"]),
  identifiesHazardsAndControls: z.enum(["yes", "no"]),
  workersInductedAndTrained: z.enum(["yes", "no"]),
  maintainsHSEIncidentReports: z.enum(["yes", "no"]),
  receivedLegalNotices: z.enum(["yes", "no"]),
  hasEmergencyProcedures: z.enum(["yes", "no"]),
  hasEmergencyResponseTeam: z.enum(["yes", "no"]),
  currencyTransactions: z.array(z.string()).min(1, "Select at least one currency"),
  annualTurnover: z.string().min(1, "Annual turnover is required"),
  forecastEBITA: z.string().min(1, "Forecast EBITA is required"),
  currentRatio: z.string().min(1, "Current ratio is required"),
  inventoryTurnover: z.string().min(1, "Inventory turnover is required"),
  bankName: z.string().min(1, "Bank name is required"),
  bankBranchAddress: z.string().min(1, "Bank branch address is required"),
  turnoverLastThreeYears: z.array(z.object({
    year: z.string(),
    turnover: z.string().min(1, "Turnover is required"),
  })).length(3),
  childLabor: z.enum(["yes", "no"]),
  forcedLabor: z.enum(["yes", "no"]),
  nonDiscrimination: z.enum(["yes", "no"]),
  wagesAndBenefits: z.enum(["yes", "no"]),
  logisticAccess: z.array(z.string()).min(1, "Select at least one logistic access option"),
  distanceFromSeaport: z.string().min(1, "Distance from seaport is required"),
  exportExperience: z.enum(["yes", "no"]),
  importExportRestrictions: z.enum(["yes", "no"]),
  dataSecurityPractices: z.enum(["yes", "no"]),
  otherDocumentation: z.any().optional(),
})

export default async function ExtendedRegistrationForm() {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const currentYear = new Date().getFullYear()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      email: "",
      categories: [],
      subCategories: [],
      officeAddress: "",
      officePincode: "",
      plantAddress: "",
      plantPincode: "",
      officeStartTime: "",
      officeEndTime: "",
      offDays: [],
      maxFloorSpace: "",
      legalStatus: [],
      isPartOfLargerOrg: "no",
      isMSME: "no",
      directorName: "",
      directorEmail: "",
      directorContactNumber: "",
      managementName: "",
      managementEmail: "",
      managementContactNumber: "",
      emergencyPersonName: "",
      emergencyPersonEmail: "",
      emergencyPersonContactNumber: "",
      totalEmployees: "",
      departments: [],
      manpowerDetails: {},
      productsServices: [{ name: "", catalog: null }],
      standardOrganization: "",
      otherStandardOrganization: "",
      complianceStandards: [],
      otherComplianceStandard: "",
      hsnCodes: [{ code: "", description: "" }],
      hasDocumentedProcedures: "no",
      experienceWithEPCs: [],
      majorCustomers: [{ name: "", location: "", businessPercentage: 0 }],
      majorSubSuppliers: [{ name: "", location: "", sourcingPercentage: 0 }],
      majorProjects: [{ name: "", location: "", endCustomer: "" }],
      hasBeenBlacklisted: "no",
      hasEngagedConsultant: "no",
      hasDocumentedQMS: "no",
      isQualitySystemDocumentationAvailable: "no",
      hasCompletedManagementReview: "no",
      hasDocumentedHSSESystem: "no",
      hasDrugsAlcoholPolicy: "no",
      identifiesHazardsAndControls: "no",
      workersInductedAndTrained: "no",
      maintainsHSEIncidentReports: "no",
      receivedLegalNotices: "no",
      hasEmergencyProcedures: "no",
      hasEmergencyResponseTeam: "no",
      currencyTransactions: [],
      annualTurnover: "",
      forecastEBITA: "",
      currentRatio: "",
      inventoryTurnover: "",
      bankName: "",
      bankBranchAddress: "",
      turnoverLastThreeYears: [
        { year: `${currentYear - 2}-${currentYear - 1}`, turnover: "" },
        { year: `${currentYear - 1}-${currentYear}`, turnover: "" },
        { year: `${currentYear}-${currentYear + 1}`, turnover: "" },
      ],
      childLabor: "no",
      forcedLabor: "no",
      nonDiscrimination: "no",
      wagesAndBenefits: "no",
      logisticAccess: [],
      distanceFromSeaport: "",
      exportExperience: "no",
      importExportRestrictions: "no",
      dataSecurityPractices: "no",
    },
  })

  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control: form.control,
    name: "productsServices",
  })

  const { fields: hsnFields, append: appendHsn, remove: removeHsn } = useFieldArray({
    control: form.control,
    name: "hsnCodes",
  })

  const { fields: customerFields, append: appendCustomer, remove: removeCustomer } = useFieldArray({
    control: form.control,
    name: "majorCustomers",
  })

  const { fields: subSupplierFields, append: appendSubSupplier, remove: removeSubSupplier } = useFieldArray({
    control: form.control,
    name: "majorSubSuppliers",
  })

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: "majorProjects",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Extract top-level fields
    const { organizationName, email, ...restValues } = values;

    // Prepare metadata by mapping form values to schema-compliant types and structures
    const metadata = {
      categories: restValues.categories,
      sub_categories: restValues.subCategories,
      office_address: restValues.officeAddress,
      office_pincode: restValues.officePincode,
      plant_address: restValues.plantAddress,
      plant_pincode: restValues.plantPincode,
      office_start_time: restValues.officeStartTime,
      office_end_time: restValues.officeEndTime,
      max_floor_space: parseInt(restValues.maxFloorSpace, 10) || null,
      legal_status: restValues.legalStatus || [],
      is_part_of_larger_org: restValues.isPartOfLargerOrg === "yes",
      year_of_incorporation: parseInt(restValues.yearOfIncorporation, 10) || null,
      gst_number: restValues.gstNumber || null,
      gst_registration_state: restValues.gstRegistrationState || null,
      is_msme: restValues.isMSME === "yes",
      pan_number: restValues.panNumber || null,
      cin_number: restValues.cinNumber || null,
      website: restValues.website || null,
      contact_number: restValues.contactNumber || null,
      director_name: restValues.directorName || null,
      director_email: restValues.directorEmail || null,
      director_contact_number: restValues.directorContactNumber || null,
      management_name: restValues.managementName || null,
      management_email: restValues.managementEmail || null,
      management_contact_number: restValues.managementContactNumber || null,
      emergency_person_name: restValues.emergencyPersonName || null,
      emergency_person_email: restValues.emergencyPersonEmail || null,
      emergency_person_contact_number: restValues.emergencyPersonContactNumber || null,
      total_employees: restValues.totalEmployees || null,
      departments: restValues.departments || [],
      manpower_details: restValues.manpowerDetails,
      products_services: restValues.productsServices.map(ps => ({
        name: ps.name,
        catalog: ps.catalog || null
      })),
      standard_organization: restValues.standardOrganization || null,
      other_standard_organization: restValues.otherStandardOrganization || null,
      compliance_standards: restValues.complianceStandards || [],
      hsn_codes: restValues.hsnCodes.map(code => ({
        code: code.code,
        description: code.description
      })),
      has_documented_procedures: restValues.hasDocumentedProcedures === "yes",
      experience_with_epcs: restValues.experienceWithEPCs || [],
      major_customers: restValues.majorCustomers.map(cust => ({
        name: cust.name,
        location: cust.location,
        business_percentage: parseFloat(String(cust.businessPercentage)) || 0
      })),
      major_sub_suppliers: restValues.majorSubSuppliers.map(sub => ({
        name: sub.name,
        location: sub.location,
        sourcing_percentage: parseFloat(String(sub.sourcingPercentage)) || 0
      })),
      major_projects: restValues.majorProjects.map(proj => ({
        name: proj.name,
        location: proj.location,
        end_customer: proj.endCustomer
      })),
      has_been_blacklisted: restValues.hasBeenBlacklisted === "yes",
      has_engaged_consultant: restValues.hasEngagedConsultant === "yes",
      has_documented_qms: restValues.hasDocumentedQMS === "yes",
      is_quality_system_documentation_available: restValues.isQualitySystemDocumentationAvailable === "yes",
      has_completed_management_review: restValues.hasCompletedManagementReview === "yes",
      has_documented_hsse_system: restValues.hasDocumentedHSSESystem === "yes",
      is_hse_management_system_certified: restValues.isHSEManagementSystemCertified === "yes",
      hse_overseer_info: restValues.hseOverseerInfo || null,
      has_drugs_alcohol_policy: restValues.hasDrugsAlcoholPolicy === "yes",
      identifies_hazards_and_controls: restValues.identifiesHazardsAndControls === "yes",
      workers_inducted_and_trained: restValues.workersInductedAndTrained === "yes",
      maintains_hse_incident_reports: restValues.maintainsHSEIncidentReports === "yes",
      received_legal_notices: restValues.receivedLegalNotices === "yes",
      has_emergency_procedures: restValues.hasEmergencyProcedures === "yes",
      has_emergency_response_team: restValues.hasEmergencyResponseTeam === "yes",
      currency_transactions: restValues.currencyTransactions || [],
      annual_turnover: restValues.annualTurnover || null,
      forecast_ebita: restValues.forecastEBITA || null,
      current_ratio: restValues.currentRatio || null,
      inventory_turnover: restValues.inventoryTurnover || null,
      bank_name: restValues.bankName || null,
      bank_branch_address: restValues.bankBranchAddress || null,
      turnover_last_three_years: restValues.turnoverLastThreeYears.map(turnover => ({
        year: turnover.year,
        turnover: turnover.turnover
      })),
      child_labor: restValues.childLabor === "yes",
      forced_labor: restValues.forcedLabor === "yes",
      non_discrimination: restValues.nonDiscrimination === "yes",
      wages_and_benefits: restValues.wagesAndBenefits === "yes",
      logistic_access: restValues.logisticAccess || [],
      distance_from_seaport: parseInt(restValues.distanceFromSeaport, 10) || null,
      export_experience: restValues.exportExperience === "yes",
      import_export_restrictions: restValues.importExportRestrictions === "yes",
      data_security_practices: restValues.dataSecurityPractices === "yes"
    };

    // Insert organization data into Supabase
    const { data, error } = await createClient().from('organizations_main').insert([
      {
        organization_name: organizationName,
        email: email,
        metadata: metadata  // Store all validated metadata
      }
    ]);

    if (error) {
      console.log(values);
      console.error('Error inserting data:', error.message);
    } else {
      console.log(values);
      console.log('Successfully inserted data:', data);
    }
  }




  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Company Registration Form</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter organization name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter organization email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main-Categories</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      const currentValues = Array.isArray(field.value) ? field.value : [];
                      field.onChange(
                        currentValues.includes(value)
                          ? currentValues.filter((v) => v !== value)
                          : [...currentValues, value]
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      {item}
                      <button
                        type="button"
                        className="ml-1 text-xs"
                        onClick={() => {
                          const newValue = field.value.filter((_, i) => i !== index);
                          field.onChange(newValue);
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subCategories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub-Categories</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      const currentValues = Array.isArray(field.value) ? field.value : [];
                      field.onChange(
                        currentValues.includes(value)
                          ? currentValues.filter((v) => v !== value)
                          : [...currentValues, value]
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      {item}
                      <button
                        type="button"
                        className="ml-1 text-xs"
                        onClick={() => {
                          const newValue = field.value.filter((_, i) => i !== index);
                          field.onChange(newValue);
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="officeAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter office address"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="officePincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Pincode</FormLabel>
                <FormControl>
                  <Input placeholder="Enter office pincode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plantAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plant Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter plant address"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plantPincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plant Pincode</FormLabel>
                <FormControl>
                  <Input placeholder="Enter plant pincode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="officeStartTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="officeEndTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="offDays"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Off Days</FormLabel>
                  <FormDescription>
                    Select the days when the office is closed.
                  </FormDescription>
                </div>
                {weekdays.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="offDays"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item
                                    )
                                  )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />

                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxFloorSpace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Floor Space (sq ft)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter maximum floor space" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="legalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      const currentValues = Array.isArray(field.value) ? field.value : [];
                      field.onChange(
                        currentValues.includes(value)
                          ? currentValues.filter((v) => v !== value)
                          : [...currentValues, value]
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select legal status" />
                    </SelectTrigger>
                    <SelectContent>
                      {legalStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      {item}
                      <button
                        type="button"
                        className="ml-1 text-xs"
                        onClick={() => {
                          const newValue = field.value.filter((_, i) => i !== index);
                          field.onChange(newValue);
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPartOfLargerOrg"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Is your company part of a larger organization?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("isPartOfLargerOrg") === "yes" && (
            <>
              <FormField
                control={form.control}
                name="largerOrgName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of the larger organization</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="yearOfIncorporation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of company incorporation</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gstNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gstRegistrationState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Registration State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="esiRegistrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ESI Registration Number (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pfRegistrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PF Registration Number (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dunsNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DUNS/D&B Number (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isMSME"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Is your company MSME/SSI/NSIC registered?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("isMSME") === "yes" && (
            <FormField
              control={form.control}
              name="msmeAttachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MSME/SSI/NSIC Certificate</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} value={field.value?.filename} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="panNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cinNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CIN Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fax (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="directorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Director's Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="directorEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Director's Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="directorContactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Director's Contact Number</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="managementName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Management's Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="managementEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Management's Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="managementContactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Management's Contact Number</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergencyPersonName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Person's Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergencyPersonEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Person's Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergencyPersonContactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Person's Number</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalEmployees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Number of Employees</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employeeRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departments"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Departments</FormLabel>
                  <FormDescription>
                    Select the departments present in your organization.
                  </FormDescription>
                </div>
                {departments.map((department) => (
                  <FormItem
                    key={department}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value.includes(department)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...field.value, department]
                            : field.value.filter((value) => value !== department);
                          field.onChange(updatedValue);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{department}</FormLabel>
                  </FormItem>
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manpowerDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manpower Details</FormLabel>
                <FormDescription>
                  Enter the number of employees for each category.
                </FormDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {manpowerCategories.map((category) => (
                    <FormItem key={category}>
                      <FormLabel>{category}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter number"
                          {...field}
                          value={field.value[category] || ""}
                          onChange={(e) => {
                            const updatedValue = { ...field.value, [category]: e.target.value };
                            field.onChange(updatedValue);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h3 className="text-lg font-semibold mb-4">Products/Services Offered</h3>
            {productFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`productsServices.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product/Service Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`productsServices.${index}.catalog`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Catalog</FormLabel>
                      <FormControl>
                        <Input type="file" {...field} value={field.value?.filename} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeProduct(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => appendProduct({ name: "", catalog: null })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product/Service
            </Button>
          </div>

          <FormField
            control={form.control}
            name="standardOrganization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Standard Organization Follow</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select standard organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {standardOrganizations.map((org) => (
                      <SelectItem key={org} value={org}>
                        {org}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("standardOrganization") === "Other" && (
            <FormField
              control={form.control}
              name="otherStandardOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify Other Standard Organization</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="complianceStandards"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Standards You Comply</FormLabel>
                  <FormDescription>
                    Select all the standards that your organization complies with.
                  </FormDescription>
                </div>
                {complianceStandards.map((standard) => (
                  <FormField
                    key={standard}
                    control={form.control}
                    name="complianceStandards"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={standard}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(standard)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, standard])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== standard
                                    )
                                  )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {standard}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("complianceStandards")?.includes("Other") && (
            <FormField
              control={form.control}
              name="otherComplianceStandard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify Other Compliance Standard</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">HSN Codes</h3>
            {hsnFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`hsnCodes.${index}.code`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>HSN Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`hsnCodes.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeHsn(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => appendHsn({ code: "", description: "" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add HSN Code
            </Button>
          </div>

          <FormField
            control={form.control}
            name="hasDocumentedProcedures"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  Does your company have documented procedures and controls in place for selection, approval, and monitoring of: Suppliers, Service Providers, Contractors and Consultants?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceWithEPCs"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Select experience with reputed EPC's</FormLabel>
                  <FormDescription>
                    Select all the EPC's that your organization has experience with.
                  </FormDescription>
                </div>
                {reputedEPCs.map((epc) => (
                  <FormField
                    key={epc}
                    control={form.control}
                    name="experienceWithEPCs"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={epc}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(epc)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, epc])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== epc
                                    )
                                  )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {epc}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h3 className="text-lg font-semibold mb-4">Major Current/Potential Customers</h3>
            {customerFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`majorCustomers.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`majorCustomers.${index}.location`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`majorCustomers.${index}.businessPercentage`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>% of Business</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeCustomer(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => appendCustomer({ name: "", location: "", businessPercentage: 0 })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Major Sub-Suppliers</h3>
            {subSupplierFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`majorSubSuppliers.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Sub-Supplier Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`majorSubSuppliers.${index}.location`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`majorSubSuppliers.${index}.sourcingPercentage`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>% of Sourcing</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeSubSupplier(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => appendSubSupplier({ name: "", location: "", sourcingPercentage: 0 })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Sub-Supplier
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Major Projects</h3>
            {projectFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`majorProjects.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`majorProjects.${index}.location`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`majorProjects.${index}.endCustomer`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End Customer</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeProject(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => appendProject({ name: "", location: "", endCustomer: "" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          <div>
            <FormField
              control={form.control}
              name="hasBeenBlacklisted"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Have you faced blacklisting/banning/Tender Holiday by any PSU in the last 5 years?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("hasBeenBlacklisted") === "yes" && (
              <FormField
                control={form.control}
                name="blacklistingDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Blacklisting Document</FormLabel>
                    <FormControl>
                      <Input type="file" {...field} value={field.value?.filename} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="hasEngagedConsultant"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Have you engaged a consultant to assist you?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("hasEngagedConsultant") === "yes" && (
              <>
                <FormField
                  control={form.control}
                  name="consultantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of the Consultant</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consultancyFirmName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of the Consultancy Firm</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quality</h3>
            <FormField
              control={form.control}
              name="hasDocumentedQMS"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Do you have documented QMS?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("hasDocumentedQMS") === "yes" && (
              <FormField
                control={form.control}
                name="qmsCertificationStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="py-1">Certification structure for QMS</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select certification structure" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single Site</SelectItem>
                        <SelectItem value="multi">Multi Site</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="isQualitySystemDocumentationAvailable"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Is your quality system documentation available for review?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasCompletedManagementReview"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Have you completed one Management review after internal audit?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("hasCompletedManagementReview") === "yes" && (
              <FormField
                control={form.control}
                name="surveillanceAuditFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please indicate the desired frequency of surveillance audits in three-year cycle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select surveillance audit frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="sixMonth">Six Month</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">HSE (Health, Safety, and Environment)</h3>
            <FormField
              control={form.control}
              name="hasDocumentedHSSESystem"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Do you have a documented HSSE (Health, Safety, Security, Environment) Management System?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("hasDocumentedHSSESystem") === "yes" && (
              <FormField
                control={form.control}
                name="isHSEManagementSystemCertified"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>
                      Is your HSE Management System Certified?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="hseOverseerInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name and title of the person responsible for overseeing HSE matters at your worksite, and the reporting lines to top management</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasDrugsAlcoholPolicy"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Do you have a written Drugs/Alcohol abuse policy?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identifiesHazardsAndControls"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Do you identify the hazards and controls related to the work being carried out?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workersInductedAndTrained"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Are all workers in your organization inducted and trained for the work they perform?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maintainsHSEIncidentReports"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Do you maintain HSE incident statistics reports (e.g., LTI - Lost Time Injuries, NM - Near Misses, Incidents)?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receivedLegalNotices"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Has your organization received any legal notices or fines in the past 3 years?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasEmergencyProcedures"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Do you have documented procedures for emergency situations?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasEmergencyResponseTeam"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Do you have a designated emergency response team?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Financial</h3>
            <FormField
              control={form.control}
              name="currencyTransactions"
              render={() => (
                <FormItem>
                  <FormLabel>Currency Transaction acceptable</FormLabel>
                  <div className="space-y-2">
                    {currencyOptions.map((option) => (
                      <FormField
                        key={option.value}
                        control={form.control}
                        name="currencyTransactions"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.value])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.value
                                        )
                                      )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="annualTurnover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Turnover</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="forecastEBITA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forecast EBITA for current year</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentRatio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Ratio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inventoryTurnover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory Turnover</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankBranchAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Branch Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h4 className="text-md font-semibold mb-2">Company Size - Turnover for Last 3 Years</h4>
              {form.watch("turnoverLastThreeYears").map((yearData, index) => (
                <FormField
                  key={yearData.year}
                  control={form.control}
                  name={`turnoverLastThreeYears.${index}.turnover`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{yearData.year}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Code of Conduct</h3>
            <FormField
              control={form.control}
              name="childLabor"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Child labor?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="forcedLabor"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Forced labor?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nonDiscrimination"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Non-discrimination and respect for employees?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wagesAndBenefits"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Wages and benefits as per law?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Logistic</h3>
            <FormField
              control={form.control}
              name="logisticAccess"
              render={() => (
                <FormItem>
                  <FormLabel>Availability to your facility/site by</FormLabel>
                  <div className="space-y-2">
                    {logisticOptions.map((option) => (
                      <FormField

                        key={option.value}
                        control={form.control}
                        name="logisticAccess"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.value])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.value
                                        )
                                      )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distanceFromSeaport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance from nearest seaport (in kilometers)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exportExperience"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Do you have experience in exporting goods and export packing?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="importExportRestrictions"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Are there any import/export restrictions for your company?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Other Information</h3>
            <FormField
              control={form.control}
              name="dataSecurityPractices"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Efficient data security practices are in place?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherDocumentation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Any other relevant documentation (e.g. Catalogue, Brochures)</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} value={field.value?.filename} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}