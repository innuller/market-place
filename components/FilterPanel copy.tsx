// components/FilterPanel.tsx
'use client'
import React from 'react'

const filterOptions: Record<string, string[]> = {
  categories: ["Manufacturing","Technology","Healthcare","Finance","Retail","Education",],
  total_employees: ["1-49", "50-100", "100-500"],
  compliance_standards: ["ISO 9001:2015", "ISO 14001:2015"],
  hsn_codes: ["HSN1", "HSN2"],
  logistic_access: ["LAND_ROAD","MOTORWAY","RAILWAY","RIVERPORT","AIRPORT","SEAPORT"]
}

interface FilterPanelProps {
  filters: Record<string, string[]>
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
}

export default function FilterPanel({ filters, setFilters }: FilterPanelProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key]?.includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...(prev[key] || []), value]
    }))
  }

  return (
    <aside className="w-1/4 p-4 border-r border-gray-200">
      <h2 className="font-bold mb-4">Filters</h2>
      {Object.keys(filterOptions).map((key) => (
        <div key={key} className="mb-4">
          <h3 className="font-semibold">{key}</h3>
          {filterOptions[key].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters[key]?.includes(option) || false}
                onChange={() => handleFilterChange(key, option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ))}
    </aside>
  )
}
