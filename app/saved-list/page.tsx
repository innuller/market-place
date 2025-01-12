// @ts-nocheck

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, Users, MapPin, Briefcase, Tag, Building, DollarSign, Calendar, BookOpen, MessageSquare, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

export default function SavedCompaniesPage() {
    const [savedCompanies, setSavedCompanies] = useState<Organization[]>([])
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchUserAndCompanies = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
                await fetchSavedCompanies(user.id)
            }
            setLoading(false)
        }

        fetchUserAndCompanies()
        const subscription = subscribeToSavedCompanies()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const fetchSavedCompanies = async (userId: string) => {
        const { data, error } = await supabase
            .from('saved_companies')
            .select(`
          company_id,
          organizations_main (
            id,
            organization_name,
            email,
            metadata
          )
        `)
            .eq('user_id', userId)

        if (error) {
            console.error('Error fetching saved companies:', error)
        } else {
            setSavedCompanies(data.map(item => item.organizations_main as Organization))
        }
    }

    const subscribeToSavedCompanies = () => {
        return supabase
            .channel('saved_companies_changes')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'saved_companies',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    if (payload.eventType === 'DELETE') {
                        setSavedCompanies(prev => prev.filter(company => company.id !== payload.old.company_id))
                    } else if (payload.eventType === 'INSERT') {
                        fetchSavedCompanies(userId!)
                    }
                }
            )
            .subscribe()
    }

    const handleRemoveCompany = async (id: string) => {
        try {
            const { error } = await supabase
                .from('saved_companies')
                .delete()
                .eq('user_id', userId)
                .eq('company_id', id)

            if (error) throw error

            console.log('Company removed from saved list:', id)
        } catch (error) {
            console.error('Error removing company:', error)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-white">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-[#003853] text-white p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Saved Companies</h1>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    <div className="space-y-4">
                        {savedCompanies.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-lg">No saved companies found</p>
                                <p className="text-sm text-white/70">Start saving companies to see them here</p>
                            </div>
                        ) : (
                            savedCompanies.map((org) => (
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
                                            {/* <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveCompany(org.id)}
                                                className="text-[#7AB80E] hover:text-white hover:bg-white/10"
                                            >
                                                <Save className={`h-4 w-4 ${savedCompanies.includes(org.id) ? 'text-[#7AB80E]' : ''}`} />
                                            </Button> */}
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
                                                    Categories: {org.metadata.categories}
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
                                    <CardFooter className="flex justify-end">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="text-white bg-[#7AB80E] border-white/20 hover:bg-[#63a029] hover:text-white">
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
                                        {/* <div className="space-x-2">
                                            <Button
                                                variant="outline"
                                                className="text-white bg-[#7AB80E] border-white/20 hover:bg-[#63a029] hover:text-white"
                                            >
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Send Message
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="text-white bg-[#7AB80E] border-white/20 hover:bg-[#63a029] hover:text-white"
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                Request Quote
                                            </Button>
                                        </div> */}
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}