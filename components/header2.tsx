'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

const supabase = createClient()

export function Header() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    // Initial user check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-[#003853] border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#003853] text-white">
              <div className="flex flex-col gap-4 mt-8">
                {(!user || user?.user_metadata?.user_type === 'user') && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-lg">For Buyers</DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href="/search" className="w-full">Find Product/Service</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/search" className="w-full">Find Supplier</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/search" className="w-full">Find Catalogue</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/contact-us" className="w-full">Contact Us</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {(!user || user?.user_metadata?.user_type === 'company') && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-lg">For Suppliers</DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href="/auth" className="w-full">Register Your Business</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/contact-us" className="w-full">Contact Us</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Link href="/about" className="text-lg">About Us</Link>
                <Link href="/auth" className="text-lg">Register your business</Link>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-white text-xl md:text-2xl font-bold">
            <Image src="/images/i/bg-Innuler-1.png" alt="Innuller" width={150} height={40} />
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-white/90">
            {(!user || user?.user_metadata?.user_type === 'user') && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:text-white">For Buyers</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/search" className="w-full">Find Product/Service</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/search" className="w-full">Find Supplier</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/search" className="w-full">Find Catalogue</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contact-us" className="w-full">Contact Us</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {(!user || user?.user_metadata?.user_type === 'company') && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:text-white">For Suppliers</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/auth" className="w-full">Register Your Business</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contact-us" className="w-full">Contact Us</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/about" className="hidden lg:inline-block text-white/90 hover:text-white">
            About Us
          </Link>
          {user?.user_metadata?.user_type === 'company' && (
            <>
              <Link href="/chat/company" className="hidden lg:inline-block text-white/90 hover:text-white">
                Messages
              </Link>
              <Link href="/saved-list" className="hidden lg:inline-block text-white/90 hover:text-white">
                Favorites
              </Link>
            </>
          )}
          {user?.user_metadata?.user_type === 'user' && (
            <>
              <Link href="/protected" className="hidden lg:inline-block text-white/90 hover:text-white">
                My Profile
              </Link>
              <Link href="/chat/user" className="hidden lg:inline-block text-white/90 hover:text-white">
                Messages
              </Link>
              <Link href="/saved-list" className="hidden lg:inline-block text-white/90 hover:text-white">
                Favorites
              </Link>
            </>
          )}
          {!user ? (
            <>
              <Link href="/auth" className="text-white/90 hover:text-white">
                Login
              </Link>
              <Link href="/auth">
                <Button className="bg-[#7AB80E] hover:bg-[#8BC727] text-white text-sm md:text-base">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <Button onClick={handleSignOut} className="bg-[#7AB80E] hover:bg-[#8BC727] text-white text-sm md:text-base">
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
