'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from 'lucide-react'

const supabase = createClient()

export default function CompanySignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: 'company'
          }
        }
      })
      if (signUpError) throw signUpError

      if (data.user) {
        // Insert into organizations_main
        const { error: orgError } = await supabase
          .from('organizations_main')
          .insert({ 
            organization_name: organizationName, 
            email, 
            phone, 
            address, 
            website,
            user: data.user.id,
            metadata: {},
            is_verified: false,
            status: 'pending'
          })

        if (orgError) {
          console.error('Organization insertion error:', orgError)
          throw orgError
        }

        // Insert into company_approvals
        const { error: approvalError } = await supabase
          .from('company_approvals')
          .insert({ 
            user_id: data.user.id,
            is_approved: false
          })

        if (approvalError) {
          console.error('Approval insertion error:', approvalError)
          throw approvalError
        }

        router.push('/pending-approval')
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      setError(error.message || 'An error occurred during sign up')
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#003853] p-4">
      <Card className="w-full max-w-md bg-white/5 text-white border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Company Sign Up</CardTitle>
          <CardDescription>Create a new company account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 text-white border-white/20 pr-10"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-[#7AB80E] hover:bg-[#8BC727] text-white">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already have an account?{' '}
            <a href="/signin/company" className="text-[#7AB80E] hover:underline">
              Sign In
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}