'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

const supabase = createClient()

export default function CompanyQuotes() {
  const [quotes, setQuotes] = useState([])
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [companyId, setCompanyId] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchCompanyAndQuotes = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        // Assuming the company ID is stored in the user's metadata
        const companyId = user.user_metadata.organization_id
        setCompanyId(companyId)
        fetchQuotes(companyId)
      }
    }
    fetchCompanyAndQuotes()
  }, [])

  useEffect(() => {
    if (selectedQuote) {
      fetchMessages(selectedQuote.id)
    }
  }, [selectedQuote])

  const fetchQuotes = async (companyId) => {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching quotes:', error)
    } else {
      setQuotes(data)
    }
  }

  const fetchMessages = async (quoteId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
    } else {
      setMessages(data)
    }
  }

  const handleStatusChange = async (quoteId, newStatus) => {
    const { error } = await supabase
      .from('quotes')
      .update({ status: newStatus })
      .eq('id', quoteId)
      .eq('company_id', companyId)

    if (error) {
      console.error('Error updating quote status:', error)
    } else {
      fetchQuotes(companyId)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId) return

    const { error } = await supabase
      .from('messages')
      .insert({
        quote_id: selectedQuote.id,
        sender_id: userId,
        content: newMessage,
      })

    if (error) {
      console.error('Error sending message:', error)
    } else {
      setNewMessage('')
      fetchMessages(selectedQuote.id)
    }
  }

  return (
    <div className="flex h-screen bg-[#003853] text-white">
      <div className="w-1/3 p-4 border-r border-white/10">
        <h2 className="text-2xl font-bold mb-4">Quotes</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {quotes.map((quote) => (
            <Card key={quote.id} className="mb-4 bg-white/5 text-white border-white/10">
              <CardHeader>
                <CardTitle>{quote.project_title}</CardTitle>
                <CardDescription>{new Date(quote.created_at).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Status: {quote.status}</p>
                <p>Requested by: {quote.first_name} {quote.last_name}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => setSelectedQuote(quote)} className="text-white border-white/20 bg-[#7AB80E] hover:text-black">
                  View Details
                </Button>
                <div>
                  <Button onClick={() => handleStatusChange(quote.id, 'fulfilled')} className="mr-2 text-white border-white/20 bg-[#7AB80E] hover:text-black">
                    Fulfill
                  </Button>
                  <Button onClick={() => handleStatusChange(quote.id, 'rejected')} className="text-white border-white/20 bg-[#7AB80E] hover:text-black">
                    Reject
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </ScrollArea>
      </div>
      <div className="w-2/3 p-4">
        {selectedQuote ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Quote Details</h2>
            <Card className="mb-4 bg-white/5 text-white border-white/10">
              <CardHeader>
                <CardTitle>{selectedQuote.project_title}</CardTitle>
                <CardDescription>{new Date(selectedQuote.created_at).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Description: {selectedQuote.project_description}</p>
                <p>Date Needed: {selectedQuote.date_needed}</p>
                <p>Phone: {selectedQuote.phone_number}</p>
                <p>Zip Code: {selectedQuote.zip_code}</p>
                <p>Shipping Instructions: {selectedQuote.shipping_instructions}</p>
                <p>Requested by: {selectedQuote.first_name} {selectedQuote.last_name}</p>
                <p>Company: {selectedQuote.company_name}</p>
                <p>Email: {selectedQuote.email}</p>
                {selectedQuote.project_file_url && (
                  <a href={selectedQuote.project_file_url} target="_blank" rel="noopener noreferrer" className="text-[#7AB80E] hover:underline">
                    View Project File
                  </a>
                )}
              </CardContent>
            </Card>
            <h3 className="text-xl font-bold mb-2">Messages</h3>
            <ScrollArea className="h-[calc(100vh-24rem)] mb-4">
              {messages.map((message) => (
                <Card key={message.id} className="mb-2 bg-white/5 text-white border-white/10">
                  <CardHeader>
                    <CardTitle>{message.sender_id === userId ? 'You' : 'Customer'}</CardTitle>
                    <CardDescription>{new Date(message.created_at).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{message.content}</p>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
            <div className="flex">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-grow bg-white/10 text-white placeholder-white/50 border-white/20 mr-2"
              />
              <Button onClick={handleSendMessage} className="text-white border-white/20 bg-[#7AB80E] hover:text-black">
                Send
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-xl">Select a quote to view details and chat</p>
        )}
      </div>
    </div>
  )
}