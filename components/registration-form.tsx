import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Badge } from "@/components/ui/badge"

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

const formSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
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
  yearOfIncorporation: z.string().optional(),
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
})

export default function ExtendedRegistrationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
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
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Extended Registration Form</h2>
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
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (!field.value.includes(value)) {
                        field.onChange([...field.value, value]);
                      }
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
                      if (!field.value.includes(value)) {
                        field.onChange([...field.value, value]);
                      }
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
                      if (!field.value.includes(value)) {
                        field.onChange([...field.value, value]);
                      }
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
                render={({ field })   => (
                  <FormItem>
                    <FormLabel>Name of the larger organization</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </>
          )}

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

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}