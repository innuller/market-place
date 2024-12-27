'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Users, Briefcase, Calendar, Building, DollarSign, Tag, BookOpen, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

interface Organization {
  id: string;
  organization_name: string;
  email: string;
  metadata: {
    website?: string;
    total_employees?: string;
    logistic_access?: string[];
    products_services?: Array<{ name: string; catalog: string | null }>;
    compliance_standards?: string[];
    categories?: string[];
    legal_status?: string[];
    annual_turnover?: string;
    year_of_incorporation?: number;
    [key: string]: any;
  };
}

interface ResultsPanelProps {
  results: Organization[];
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false)
  const [messageContent, setMessageContent] = useState('')
  const [quoteContent, setQuoteContent] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchTerm)
  }

  const handleCompanySelection = (id: string) => {
    setSelectedCompanies(prev => 
      prev.includes(id) ? prev.filter(companyId => companyId !== id) : [...prev, id]
    )
  }

  const handleSaveCompany = (id: string) => {
    console.log('Saving company:', id)
  }

  const handleSendMessage = () => {
    console.log('Sending message to:', selectedCompanies)
    console.log('Message content:', messageContent)
    setMessageDialogOpen(false)
    setMessageContent('')
  }

  const handleRequestQuote = () => {
    console.log('Requesting quote from:', selectedCompanies)
    console.log('Quote content:', quoteContent)
    setQuoteDialogOpen(false)
    setQuoteContent('')
  }

  useEffect(() => {
    console.log('Results updated in ResultsPanel:', results);
  }, [results]);

  return (
    <div className="flex flex-col h-full bg-[#003853] text-white">
      <div className="p-4 border-b border-white/10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-white/10 text-white placeholder-white/50 border-white/20"
          />
          <Button type="submit" className="bg-[#7AB80E] hover:bg-[#8BC727] text-white">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <span className="font-semibold">{results.length}</span> companies found
        </div>
        <div className="space-x-2">
          <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="text-white border-white/20 hover:bg-[#7AB80E] hover:text-white"
                disabled={selectedCompanies.length === 0}
              >
                Send Message
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#003853] text-white border-white/10">
              <DialogHeader>
                <DialogTitle>Send Message</DialogTitle>
                <DialogDescription>
                  Send a message to {selectedCompanies.length} selected companies.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                className="bg-white/10 text-white placeholder-white/50 border-white/20"
              />
              <DialogFooter>
                <Button onClick={handleSendMessage} className="bg-[#7AB80E] hover:bg-[#8BC727] text-white">
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="text-white border-white/20 hover:bg-[#7AB80E] hover:text-white"
                disabled={selectedCompanies.length === 0}
              >
                Request Quote
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#003853] text-white border-white/10">
              <DialogHeader>
                <DialogTitle>Request Quote</DialogTitle>
                <DialogDescription>
                  Request a quote from {selectedCompanies.length} selected companies.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={quoteContent}
                onChange={(e) => setQuoteContent(e.target.value)}
                placeholder="Describe your quote request here..."
                className="bg-white/10 text-white placeholder-white/50 border-white/20"
              />
              <DialogFooter>
                <Button onClick={handleRequestQuote} className="bg-[#7AB80E] hover:bg-[#8BC727] text-white">
                  Send Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg">No results found</p>
              <p className="text-sm text-white/70">Try adjusting your filters</p>
            </div>
          ) : (
            results.map((org) => (
              <Card key={org.id} className="bg-white/5 text-white border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-xl">{org.organization_name}</CardTitle>
                    <CardDescription className="text-white/70">
                      {org.metadata.website && (
                        <a href={org.metadata.website} target="_blank" rel="noopener noreferrer" className="text-[#7AB80E] hover:underline">
                          {org.metadata.website}
                        </a>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSaveCompany(org.id)}
                      className="text-white hover:text-[#7AB80E] hover:bg-white/10"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Checkbox
                      checked={selectedCompanies.includes(org.id)}
                      onCheckedChange={() => handleCompanySelection(org.id)}
                      className="border-white/50 data-[state=checked]:bg-[#7AB80E] data-[state=checked]:border-[#7AB80E]"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {org.metadata.total_employees || 'N/A'} employees
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Logistics: {org.metadata.logistic_access?.join(', ') || 'N/A'}
                      </p>
                      <p className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Products/Services: {org.metadata.products_services?.map(p => p.name).join(', ') || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Categories: {org.metadata.categories || 'N/A'}
                      </p>
                      <p className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Legal Status: {org.metadata.legal_status?.join(', ') || 'N/A'}
                      </p>
                      <p className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Annual Turnover: {org.metadata.annual_turnover || 'N/A'}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Year of Incorporation: {org.metadata.year_of_incorporation || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Compliance Standards:</h4>
                    <div className="flex flex-wrap gap-2">
                      {org.metadata.compliance_standards?.map((standard, index) => (
                        <Badge key={index} variant="secondary" className="bg-[#7AB80E] text-white">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-white border-white/20 hover:bg-[#7AB80E] hover:text-white">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Catalog
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#003853] text-white border-white/10">
                      <DialogHeader>
                        <DialogTitle>{org.organization_name} Catalog</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {org.metadata.products_services?.map((product, index) => (
                          <div key={index} className="p-4 bg-white/10 rounded-lg">
                            <h3 className="font-semibold mb-2">{product.name}</h3>
                            {product.catalog ? (
                              <a
                                href={product.catalog}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#7AB80E] hover:underline"
                              >
                                View Catalog
                              </a>
                            ) : (
                              <span className="text-white/50">No catalog available</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      className="text-white border-white/20 hover:bg-[#7AB80E] hover:text-white"
                      onClick={() => {
                        setSelectedCompanies([org.id]);
                        setMessageDialogOpen(true);
                      }}
                    >
                      Send Message
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-white border-white/20 hover:bg-[#7AB80E] hover:text-white"
                      onClick={() => {
                        setSelectedCompanies([org.id]);
                        setQuoteDialogOpen(true);
                      }}
                    >
                      Request Quote
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

