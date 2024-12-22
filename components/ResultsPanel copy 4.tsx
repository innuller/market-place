"use client"

import { useState } from "react"
import { Eye, Star, PlayCircle, LibraryIcon as Catalog, ChevronRight, X } from 'lucide-react'
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Organization {
  id: number
  organization_name: string
  email: string
  metadata: Record<string, any>
  logo?: string
  location?: string
  tags?: string[]
  description?: string
  revenue?: string
  year?: string
}

interface ResultsPanelProps {
  results: Organization[]
}

function MetadataModal({ organization }: { organization: Organization }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs">
          View Details
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{organization.organization_name} Details</DialogTitle>
          <DialogDescription>Detailed information about the organization</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(organization.metadata).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{key.replace(/_/g, " ")}</TableCell>
                  <TableCell>{JSON.stringify(value, null, 2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="flex-1 p-4 space-y-4">
      <h2 className="font-bold text-xl">Approved Organizations</h2>

      {results.length > 0 ? (
        <div className="grid gap-4">
          {results.map((result) => (
            <Card key={result.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-[auto_1fr_auto]">
                  {/* Logo Section */}
                  <div className="flex items-start">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border">
                      <Image
                        src={result.logo || "/placeholder.svg"}
                        alt={result.organization_name}
                        className="object-cover"
                        fill
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{result.organization_name}</h3>
                        <Badge variant="secondary" className="hidden sm:inline-flex">
                          Verified
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{result.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {result.tags?.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{result.description}</p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <span>{result.revenue} Revenue</span>
                      <span>Est. {result.year}</span>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex flex-col sm:items-end gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Star className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button size="sm">Contact Supplier</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="ghost" size="sm">
                        Request Information
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Catalog
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>

              <Separator />

              <CardFooter className="p-4 flex gap-4">
                <Button variant="ghost" size="sm" className="text-xs">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Company Overview
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Catalog className="mr-2 h-4 w-4" />
                  View Capabilities
                </Button>
                <MetadataModal organization={result} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No matching results found.</p>
        </div>
      )}
    </div>
  )
}

