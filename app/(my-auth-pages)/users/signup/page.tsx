'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const supabase = createClient()

export default function UserSignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: any) => {
    e.preventDefault()
    try {
      const { data: userData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: 'user'
          }
        }
      })

      if (error) {
        console.log('Error in singing up new user: ', error)
      }

      if (userData) {
        setData(userData)
        setIsSubmitted(true)
        console.log(data.user.aud);
      }

      // router.push('/search')
    } catch (error: any) {
      setError(error.message)
      console.log('Error signing up:', error.message);

    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  if (isSubmitted) {

    if (data.user.aud == "authenticated") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#003853] p-4">
          <Alert className="w-full max-w-md bg-white/5 text-white border-white/10">
            <AlertTitle className='font-bold'>You are already registred</AlertTitle>
            <AlertDescription>
              Please go to Users <Link href="/users/signin" className='underline underline-offset-4 text-[#7AB80E] font-bold'>Sign In page to login.</Link>
            </AlertDescription>
          </Alert>
        </div>
      )
    }

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#003853] p-4">
      <Card className="w-full max-w-md bg-white/5 text-white border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Buyer Sign Up</CardTitle>
          <CardDescription>Create a new buyer account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="bg-white/10 text-white border-white/20"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="bg-white/10 text-white border-white/20"
                />
              </div>
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
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-[#7AB80E] hover:bg-[#8BC727] text-white">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already have an account?{' '}
            <Link href="/users/signin" className="text-[#7AB80E] hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}