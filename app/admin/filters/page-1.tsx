'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

type FilterType = 'array' | 'string' | 'number' | 'boolean' | 'object'

interface Filter {
  id: string
  name: string
  field: string
  type: FilterType
  options?: string[]
  min?: number
  max?: number
  step?: number
}

export default function FilterManagement() {
  const [filters, setFilters] = useState<Filter[]>([])
  const [newFilter, setNewFilter] = useState<Omit<Filter, 'id'>>({ name: '', field: '', type: 'array', options: [] })
  const [editingFilter, setEditingFilter] = useState<Filter | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchFilters()
  }, [])

  async function fetchFilters() {
    const { data, error } = await supabase.from('filters').select('*')
    if (error) {
      console.error('Error fetching filters:', error)
    } else {
      setFilters(data)
    }
  }

  async function handleSaveFilter() {
    const filterToSave = editingFilter || newFilter
    const { type, ...filterData } = filterToSave

    // Remove unnecessary fields based on the filter type
    if (type !== 'array') {
      delete filterData.options
    }
    if (type !== 'number') {
      delete filterData.min
      delete filterData.max
      delete filterData.step
    }

    if (editingFilter) {
      const { error } = await supabase
        .from('filters')
        .update({ ...filterData, type })
        .eq('id', editingFilter.id)
      if (error) {
        console.error('Error updating filter:', error)
      } else {
        fetchFilters()
      }
    } else {
      const { error } = await supabase.from('filters').insert({ ...filterData, type })
      if (error) {
        console.error('Error creating filter:', error)
      } else {
        fetchFilters()
      }
    }
    setIsDialogOpen(false)
    setNewFilter({ name: '', field: '', type: 'array', options: [] })
    setEditingFilter(null)
  }

  async function handleDeleteFilter(id: string) {
    const { error } = await supabase.from('filters').delete().eq('id', id)
    if (error) {
      console.error('Error deleting filter:', error)
    } else {
      fetchFilters()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Filter Management</h1>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Add New Filter
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Options/Range</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filters.map((filter) => (
            <TableRow key={filter.id}>
              <TableCell>{filter.name}</TableCell>
              <TableCell>{filter.field}</TableCell>
              <TableCell>{filter.type}</TableCell>
              <TableCell>
                {filter.type === 'array' && filter.options?.join(', ')}
                {filter.type === 'number' && `${filter.min} - ${filter.max} (step: ${filter.step})`}
              </TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => { setEditingFilter(filter); setIsDialogOpen(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => handleDeleteFilter(filter.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFilter ? 'Edit Filter' : 'Add New Filter'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editingFilter ? editingFilter.name : newFilter.name}
                onChange={(e) => editingFilter ? setEditingFilter({ ...editingFilter, name: e.target.value }) : setNewFilter({ ...newFilter, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="field" className="text-right">
                Field
              </Label>
              <Input
                id="field"
                value={editingFilter ? editingFilter.field : newFilter.field}
                onChange={(e) => editingFilter ? setEditingFilter({ ...editingFilter, field: e.target.value }) : setNewFilter({ ...newFilter, field: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={editingFilter ? editingFilter.type : newFilter.type}
                onValueChange={(value: FilterType) => editingFilter ? setEditingFilter({ ...editingFilter, type: value }) : setNewFilter({ ...newFilter, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="array">Array</SelectItem>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="object">Object</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(editingFilter?.type === 'array' || newFilter.type === 'array') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="options" className="text-right">
                  Options
                </Label>
                <Input
                  id="options"
                  value={editingFilter ? editingFilter.options?.join(', ') : newFilter.options?.join(', ')}
                  onChange={(e) => {
                    const options = e.target.value.split(',').map(option => option.trim())
                    editingFilter ? setEditingFilter({ ...editingFilter, options }) : setNewFilter({ ...newFilter, options })
                  }}
                  className="col-span-3"
                />
              </div>
            )}
            {(editingFilter?.type === 'number' || newFilter.type === 'number') && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="min" className="text-right">
                    Min
                  </Label>
                  <Input
                    id="min"
                    type="number"
                    value={editingFilter ? editingFilter.min : newFilter.min}
                    onChange={(e) => editingFilter ? setEditingFilter({ ...editingFilter, min: Number(e.target.value) }) : setNewFilter({ ...newFilter, min: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="max" className="text-right">
                    Max
                  </Label>
                  <Input
                    id="max"
                    type="number"
                    value={editingFilter ? editingFilter.max : newFilter.max}
                    onChange={(e) => editingFilter ? setEditingFilter({ ...editingFilter, max: Number(e.target.value) }) : setNewFilter({ ...newFilter, max: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="step" className="text-right">
                    Step
                  </Label>
                  <Input
                    id="step"
                    type="number"
                    value={editingFilter ? editingFilter.step : newFilter.step}
                    onChange={(e) => editingFilter ? setEditingFilter({ ...editingFilter, step: Number(e.target.value) }) : setNewFilter({ ...newFilter, step: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSaveFilter}>{editingFilter ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

