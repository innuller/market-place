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

export default function CompanySignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e:any) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      
      // Check if the user is a company
      const { data: userData, error: userError } = await supabase
        .from('organizations_main')
        .select('id')
        .eq('user', data.user.id)
        .single()

      if (userError) throw new Error('This account is not registered as a company')

      router.push('/chat/company')
    } catch (error: any) {
      setError(error.message)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#003853] p-4">
      <Card className="w-full max-w-md bg-white/5 text-white border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Company Sign In</CardTitle>
          <CardDescription>Sign in to your company account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
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
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col'>
          <p className="text-sm text-center w-full">
            Don't have an account?{' '}
            <a href="/companies/signup" className="text-[#7AB80E] hover:underline">
              Sign Up
            </a>
          </p>
          <p className="text-sm text-center w-full">
            Forgot Password?{' '}
            <a href="/forgot-password" className="text-[#7AB80E] hover:underline">
              Reset the password
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}