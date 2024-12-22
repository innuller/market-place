"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { signUpAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { SmtpMessage } from "@/app/(auth-pages)/smtp-message"
import { Eye, EyeOff } from 'lucide-react'

export default function SignUpPage({ searchParams }: { searchParams: any }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#003853] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-[#7AB80E]">
            Or{" "}
            <Link href="/signin" className="font-medium hover:text-[#8BC727]">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="full-name" className="sr-only">
                Full name
              </Label>
              <Input
                id="full-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#7AB80E] focus:border-[#7AB80E] focus:z-10 sm:text-sm"
                placeholder="Full name"
              />
            </div>
            <div>
              <Label htmlFor="email-address" className="sr-only">
                Email address
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#7AB80E] focus:border-[#7AB80E] focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#7AB80E] focus:border-[#7AB80E] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" aria-hidden="true" />
                )}
                <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
              </Button>
            </div>
            <div>
              <Label htmlFor="phone-number" className="sr-only">
                Phone Number
              </Label>
              <Input
                id="phone-number"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#7AB80E] focus:border-[#7AB80E] focus:z-10 sm:text-sm"
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox id="agree-terms" required />
            <Label
              htmlFor="agree-terms"
              className="ml-2 block text-sm text-white"
            >
              I agree to the{" "}
              <Link
                href="#"
                className="font-medium text-[#7AB80E] hover:text-[#8BC727]"
              >
                terms and conditions
              </Link>
            </Label>
          </div>

          <div>
            <SubmitButton formAction={signUpAction} pendingText="Signing up..." className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#7AB80E] hover:bg-[#8BC727] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AB80E]">
              Sign up
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </div>
  )
}

