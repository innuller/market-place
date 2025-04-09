'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Toaster } from "@/components/ui/toaster"

export default function CompanySignUp() {
  const [organizationName, setOrganizationName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [website, setWebsite] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = {
      organizationName,
      email,
      phone,
      address,
      website,
      gstNumber,
      reason
    }

    try {
      const response = await fetch('/api/send-signup-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        toast({
          title: "Request Submitted",
          description: "Your sign-up request has been sent successfully.",
        })
        // Reset form fields
        setOrganizationName('')
        setEmail('')
        setPhone('')
        setAddress('')
        setWebsite('')
        setGstNumber('')
        setReason('')
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    // return (
      // <div className="flex items-center justify-center min-h-screen bg-[#003853] p-4">
      //   <Alert className="w-full max-w-md bg-white/5 text-white border-white/10">
      //     <AlertTitle>Thank you for your submission!</AlertTitle>
      //     <AlertDescription>
      //       Your request has been received. Please wait for approval from our team. We will contact you soon.
      //     </AlertDescription>
      //   </Alert>
      // </div>
    // )
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#003853] p-4">
        <Alert className="w-full max-w-md bg-white/5 text-white border-white/10">
          <AlertTitle>Thank you for your registration</AlertTitle>
          <AlertDescription>
            Please verify your email address to complete the registration process. Open mail for verification.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setPhone(value)
  }
  
  const handleGSTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // GST numbers are uppercase
    const cleanedValue = value.replace(/[^A-Z0-9]/g, ''); // allow A-Z and 0-9 only
    setGstNumber(cleanedValue);
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#003853] p-4">
      <Card className="w-full max-w-md bg-white/5 text-white border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Company Sign Up</CardTitle>
          <CardDescription>Request a new company account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="organizationName">Company Name</Label>
              <Input
                id="organizationName"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                type="text"
                value={gstNumber}
                onChange={handleGSTChange}
                required
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason for Registration</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={15}
                required
                className="bg-white/10 text-white border-white/20"
                rows={4}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#7AB80E] hover:bg-[#8BC727] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already have an account?{' '}
            <a href="/companies/signin" className="text-[#7AB80E] hover:underline">
              Sign In
            </a>
          </p>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}


