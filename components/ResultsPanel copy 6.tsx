'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, MapPin, Users, Briefcase, Calendar, Building, DollarSign, Tag, BookOpen, Save, MessageSquare, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from '@/utils/supabase/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useRouter, useSearchParams } from 'next/navigation'

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
    year_of_incorporation?: string;
    [key: string]: any;
  };
}

interface ResultsPanelProps {
  results: Organization[];
}

interface QuoteForm {
  project_title: string;
  project_description: string;
  date_needed: string;
  project_file: File | null;
  phone_number: string;
  zip_code: string;
  shipping_instructions: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('all')
  const [sortBy, setSortBy] = useState('none')
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false)
  const [messageContent, setMessageContent] = useState('')
  const [quoteForm, setQuoteForm] = useState<QuoteForm>({
    project_title: '',
    project_description: '',
    date_needed: '',
    project_file: null,
    phone_number: '',
    zip_code: '',
    shipping_instructions: '',
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
  })
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [savedCompanies, setSavedCompanies] = useState<string[]>([]);

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const type = searchParams.get('type')
    const query = searchParams.get('query')
    if (type) setSearchType(type)
    if (query) setSearchTerm(query)
  }, [searchParams])

  const filteredResults = useMemo(() => {
    let filtered = results
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase()
      filtered = results.filter(org => {
        switch (searchType) {
          case 'supplier':
            return org.organization_name.toLowerCase().includes(lowercasedTerm)
          case 'product_service':
            return org.metadata.products_services?.some(product =>
              product.name.toLowerCase().includes(lowercasedTerm)
            )
          case 'catalog':
            return org.metadata.products_services?.some(product =>
              product.catalog?.toLowerCase().includes(lowercasedTerm)
            )
          case 'all':
          default:
            return (
              org.organization_name.toLowerCase().includes(lowercasedTerm) ||
              org.email.toLowerCase().includes(lowercasedTerm) ||
              org.metadata.products_services?.some(product =>
                product.name.toLowerCase().includes(lowercasedTerm) ||
                product.catalog?.toLowerCase().includes(lowercasedTerm)
              )
            )
        }
      })
    }

    // Apply sorting
    if (sortBy !== 'none') {
      filtered.sort((a, b) => {
        if (sortBy === 'year_of_incorporation') {
          const yearA = parseInt(a.metadata.year_of_incorporation || '0')
          const yearB = parseInt(b.metadata.year_of_incorporation || '0')
          return yearB - yearA // Sort in descending order (newest first)
        } else if (sortBy === 'annual_turnover') {
          const turnoverA = parseFloat(a.metadata.annual_turnover?.replace(/[^0-9.-]+/g,"") || '0')
          const turnoverB = parseFloat(b.metadata.annual_turnover?.replace(/[^0-9.-]+/g,"") || '0')
          return turnoverB - turnoverA // Sort in descending order (highest first)
        }
        return 0
      })
    }

    return filtered
  }, [results, searchTerm, searchType, sortBy])

  useEffect(() => {
    const fetchSavedCompanies = async () => {
      if (!currentUserId) return

      const { data, error } = await supabase
        .from('saved_companies')
        .select('company_id')
        .eq('user_id', currentUserId)

      if (error) {
        console.error('Error fetching saved companies:', error)
      } else {
        setSavedCompanies(data.map(item => item.company_id) || [])
      }
    }

    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setCurrentUserId(session?.user?.id || null)
      fetchSavedCompanies()
    }

    fetchSession()
  }, [currentUserId]); // Removed supabase from dependencies

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchTerm)
    router.push(`/search?type=${searchType}&query=${encodeURIComponent(searchTerm)}`)
  }

  const handleCompanySelection = (id: string) => {
    setSelectedCompanies(prev =>
      prev.includes(id) ? prev.filter(companyId => companyId !== id) : [...prev, id]
    )
  }

  const handleSaveCompany = async (id: string) => {
    if (!currentUserId) {
      console.log('User not logged in')
      return
    }

    try {
      const isSaved = savedCompanies.includes(id)

      if (isSaved) {
        const { error } = await supabase
          .from('saved_companies')
          .delete()
          .eq('user_id', currentUserId)
          .eq('company_id', id)

        if (error) throw error

        setSavedCompanies(prev => prev.filter(companyId => companyId !== id))
        console.log('Company removed from saved list:', id)
      } else {
        const { error } = await supabase
          .from('saved_companies')
          .insert({ user_id: currentUserId, company_id: id })

        if (error) throw error

        setSavedCompanies(prev => [...prev, id])
        console.log('Company saved successfully:', id)
      }
    } catch (error) {
      console.error('Error toggling saved company:', error)
    }
  }

  const handleSendMessage = async () => {
    if (currentUserId && selectedCompanies.length > 0 && messageContent.trim()) {
      const newMessage = {
        sender_id: currentUserId,
        receiver_id: selectedCompanies[0],
        content: messageContent,
        timestamp: new Date().toISOString(),
      }
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
      if (error) {
        console.error('Error sending message:', error)
      } else {
        console.log('Message sent successfully:', data)
        setMessageContent('')
        setMessageDialogOpen(false)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQuoteForm(prev => ({ ...prev, project_file: e.target.files![0] }))
    }
  }

  const handleRequestQuote = async () => {
    if (currentUserId && selectedCompanies.length > 0) {
      let project_file_url = null;
      if (quoteForm.project_file) {
        const fileExt = quoteForm.project_file.name.split('.').pop()
        const fileName = `${Math.random()}_${Date.now()}.${fileExt}`
        const { data, error } = await supabase.storage
          .from('project-files')
          .upload(fileName, quoteForm.project_file)

        if (error) {
          console.error('Error uploading file:', error)
          return
        }

        const { data: { publicUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(fileName)

        project_file_url = publicUrl
      }

      const newQuote = {
        user_id: currentUserId,
        company_id: selectedCompanies[0],
        project_title: quoteForm.project_title,
        project_description: quoteForm.project_description,
        date_needed: quoteForm.date_needed,
        project_file_url,
        phone_number: quoteForm.phone_number,
        zip_code: quoteForm.zip_code,
        shipping_instructions: quoteForm.shipping_instructions,
        first_name: quoteForm.first_name,
        last_name: quoteForm.last_name,
        company_name: quoteForm.company_name,
        email: quoteForm.email,
        status: 'pending',
      }

      const { data, error } = await supabase
        .from('quotes')
        .insert(newQuote)

      if (error) {
        console.error('Error requesting quote:', error)
      } else {
        console.log('Quote requested successfully:', data)
        setQuoteForm({
          project_title: '',
          project_description: '',
          date_needed: '',
          project_file: null,
          phone_number: '',
          zip_code: '',
          shipping_instructions: '',
          first_name: '',
          last_name: '',
          company_name: '',
          email: '',
        })
        setQuoteDialogOpen(false)
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#003853] text-white">
      <div className="p-4 border-b border-white/10">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white/10 text-white border-white/20">
              <SelectValue placeholder="Search type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="product_service">Product / Service</SelectItem>
              <SelectItem value="catalog">Catalog</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-grow relative">
            <Input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto text-white bg-[#7AB80E] border-white/20 hover:bg-[#63a029] hover:text-white">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="font-semibold">{filteredResults.length}</span> companies found
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white/10 text-white border-white/20">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No sorting</SelectItem>
              <SelectItem value="year_of_incorporation">Year of Incorporation</SelectItem>
              <SelectItem value="annual_turnover">Annual Turnover</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* <Dialog
            open={messageDialogOpen}
            onOpenChange={(isOpen) => {
              if (!currentUserId || selectedCompanies.length < 1) return;
              setMessageDialogOpen(isOpen);
            }}
          >
            {(!currentUserId || selectedCompanies.length < 1) ? (
              <Button
                variant="outline"
                className="flex-1 sm:flex-none text-white bg-[#7AB80E] border-white/20 opacity-50 cursor-not-allowed"
                disabled
              >
                Send Message
              </Button>
            ) : (
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none text-white bg-[#7AB80E] border-white/20 hover:bg-[#63a029] hover:text-white"
                >
                  Send Message
                </Button>
              </DialogTrigger>
            )}
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
                <Button
                  onClick={handleSendMessage}
                  className="text-white bg-[#7AB80E] border-white/20 hover:bg-[#63a029] hover:text-white"
                >
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}

          <Dialog
            open={quoteDialogOpen}
            onOpenChange={(isOpen) => {
              if (!currentUserId || selectedCompanies.length < 1) return;
              setQuoteDialogOpen(isOpen);
            }}
          >
            {(!currentUserId || selectedCompanies.length < 1) ? (
              <Button
                variant="outline"
                className="flex-1 sm:flex-none text-white bg-[#7AB80E] border-white/20 opacity-50 cursor-not-allowed"
                disabled
              >
                Request Quote
              </Button>
            ) : (
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none text-white bg-[#7AB80E] border-white/20 hover:bg-[#63a029] hover:text-white"
                >
                  Request Quote
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="bg-[#003853] text-white border-white/10 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Request Quote</DialogTitle>
                <DialogDescription>
                  Request a quote from {selectedCompanies.length} selected companies.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Quote form fields */}
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input id="projectTitle" type="text" value={quoteForm.project_title} onChange={(e) => setQuoteForm(prev => ({ ...prev, project_title: e.target.value }))} className="bg-white/10 text-white placeholder-white/50 border-white/20" />
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea id="projectDescription" value={quoteForm.project_description} onChange={(e) => setQuoteForm(prev => ({ ...prev, project_description: e.target.value }))} className="bg-white/10 text-white placeholder-white/50 border-white/20" />
                <Label htmlFor="dateNeeded">Date Needed</Label>
                <Input id="dateNeeded" type="date" value={quoteForm.date_needed} onChange={(e) => setQuoteForm(prev => ({ ...prev, date_needed: e.target.value }))} className="bg-white/10 text-white placeholder-white/50 border-white/20" />
                <Label htmlFor="projectFile">Project File</Label>
                <Input id="projectFile" type="file" onChange={handleFileChange} className="bg-white/10 text-white placeholder-white/50 border-white/20" />
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" type="tel" value={quoteForm.phone_number} onChange={(e) => setQuoteForm(prev => ({ ...prev, phone_number: e.target.value }))} className="bg-white/10 text-white placeholder-white/50 border-white/20" />
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" type="text" value={quoteForm.zip_code} onChange={(e) => setQuoteForm(prev => ({ ...prev, zip_code: e.target.value }))} className="bg-white/10 text-white placeholder-white/50 border-white/20" />
                <Label htmlFor="shippingInstructions">Shipping Instructions</Label>
                <Textarea id="shippingInstructions" value={quoteForm.shipping_instructions} onChange={(e) => setQuoteForm(prev => ({ ...prev, shipping_instructions: e.target.value }))} className="bg-white/10 text-white placeholder-white/50 border-white/20" />
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" value={quoteForm.first_name} onChange={(e) => setQuoteForm(prev => ({ ...prev, first_name: e.target.value }))} className="bg-white/10 text-white placeholder-white/50 border-white/20" />
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" value={quoteForm.last_name} onChange={(e) => setQuoteForm(prev => ({ ...prev, last_name: e.target.value }))} className="bg-white/10 text-white placeholder-white/50 border-white/20" />
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" type="text" value={quoteForm.company_name} onChange={(e) => setQuoteForm(prev => ({ ...prev, company_name: e.target.value }))} className="bg-white/10 text-white placeholder-white/50 border-white/20" />
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={quoteForm.email} onChange={(e) => setQuoteForm(prev => ({ ...prev, email: e.target.value }))} className="bg-white/10 text-white placeholder-white/50 border-white/20" />
              </div>
              <DialogFooter>
                <Button
                  onClick={handleRequestQuote}
                  className="text-white bg-[#7AB80E] border-white/20 hover:bg-[#63a029] hover:text-white"
                >
                  Send Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          {filteredResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg">No results found</p>
              <p className="text-sm text-white/70">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredResults.map((org) => (
              <Card key={org.id} className="bg-white/5 text-white border-white/10">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
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
                      className={`text-white hover:text-[#7AB80E] hover:bg-white/10 ${savedCompanies.includes(org.id) ? 'text-[#7AB80E]' : ''}`}
                    >
                      <Save className={`h-4 w-4 ${savedCompanies.includes(org.id) ? 'text-[#7AB80E]' : ''}`} />
                    </Button>
                    <Checkbox
                      checked={selectedCompanies.includes(org.id)}
                      onCheckedChange={() => handleCompanySelection(org.id)}
                      className="border-white/50 data-[state=checked]:bg-[#7AB80E] data-[state=checked]:border-[#7AB80E]"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-auto text-white bg-[#7AB80E] border-white/20 hover:bg-[#63a029] hover:text-white">
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
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {/* <Button
                      variant="outline"
                      className={`w-full sm:w-auto text-white bg-[#7AB80E] border-white/20 hover:bg-[#63a029] hover:text-white ${!currentUserId ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        setSelectedCompanies([org.id]);
                        setMessageDialogOpen(true);
                      }}
                      disabled={!currentUserId}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button> */}
                    <Button
                      variant="outline"
                      className={`w-full sm:w-auto text-white bg-[#7AB80E] border-white/20 hover:bg-[#63a029] hover:text-white ${!currentUserId ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        setSelectedCompanies([org.id]);
                        setQuoteDialogOpen(true);
                      }}
                      disabled={!currentUserId}
                    >
                      <FileText className="h-4 w-4 mr-2" />
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

// if anything breaks then bring back ResultsPanel copy 5.tsx