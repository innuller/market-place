'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, User } from 'lucide-react'
import Link from 'next/link'

export default function AuthOptionsPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleNavigation = (path: string) => {
        setIsLoading(true)
        router.push(path)
    }

    const handleEmailClick = () => {
        const email = 'umeshtak34@gmail.com';
        const subject = 'New Company Listig Request';
        const body = `
        Name: 
        Phone: 
        Reason:`;

        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
    };



    return (
        <div className="min-h-screen bg-[#003853] text-white flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-center mb-8">Choose Your Option</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <Building className="mr-2" />
                                Supplier Sign In
                            </CardTitle>
                            <CardDescription>Access your supplier account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className='text-white'>Sign in to manage your supplier profile, quotes, and messages.</p>
                        </CardContent>
                        <CardFooter>
                            <Link href="/companies/signin">
                                <Button
                                    className="w-full bg-[#7AB80E] hover:bg-[#63a029] text-white"
                                    onClick={() => handleNavigation('/signin/company')}
                                    disabled={isLoading}
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <Building className="mr-2" />
                                Supplier Sign Up
                            </CardTitle>
                            <CardDescription>Create a new supplier account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className='text-white'>Register your supplier to start receiving quotes and connecting with clients.</p>
                        </CardContent>
                        <CardFooter>
                            <div>
                                <Button
                                    className="w-full bg-[#7AB80E] hover:bg-[#63a029] text-white"
                                    onClick={() => handleNavigation('/companies/signup')}
                                    // onClick={handleEmailClick}
                                    disabled={isLoading}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <User className="mr-2" />
                                Buyer Sign In
                            </CardTitle>
                            <CardDescription>Access your buyer account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className='text-white'>Sign in to manage your profile, view quotes, and communicate with companies.</p>
                        </CardContent>
                        <CardFooter>
                            <Link href="/users/signin">
                                <Button
                                    className="w-full bg-[#7AB80E] hover:bg-[#63a029] text-white"
                                    onClick={() => handleNavigation('/signin/user')}
                                    disabled={isLoading}
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <User className="mr-2" />
                                Buyer Sign Up
                            </CardTitle>
                            <CardDescription>Create a new buyer account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className='text-white'>Register as a user to start requesting quotes and interacting with companies.</p>
                        </CardContent>
                        <CardFooter>
                            <Link href="/users/signup">
                                <Button
                                    className="w-full bg-[#7AB80E] hover:bg-[#63a029] text-white"
                                    onClick={() => handleNavigation('/signup/user')}
                                    disabled={isLoading}
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}