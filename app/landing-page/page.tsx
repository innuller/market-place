'use client'

import Link from "next/link"
import { Menu, Search, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

export default function Component() {
    return (
        <div className="min-h-screen bg-[#003853]">
            {/* Navigation */}

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12 md:py-24 text-center">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
                    Search and Buy with The Industrial Buying Engine™
                </h1>
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-2">
                    <Select>
                        <SelectTrigger className="bg-white w-full sm:w-[150px]">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="suppliers">Suppliers</SelectItem>
                            <SelectItem value="products">Products</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full h-full px-4 rounded-md"
                        />
                    </div>
                    <Button className="bg-[#7AB80E] hover:bg-[#8BC727] text-white px-8 w-full sm:w-auto">
                        Search
                    </Button>
                </div>
                <div className="mt-4 text-white">
                    New to Thomas?
                    <Link href="#" className="text-[#7AB80E] ml-2">
                        Join Free for Full Access
                    </Link>
                </div>
            </div>

            {/* Separator */}
            <div className="container mx-auto px-4">
                <Separator className="my-8 bg-white/20" />
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-8 md:py-16">
                <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center mb-12">
                    3 Ways to Find Suppliers and Get Quotes
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Discover Suppliers */}
                    <div className="text-center">
                        <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-white text-lg md:text-xl font-bold mb-4">Discover Suppliers</h3>
                        <p className="text-white/80 mb-6">
                            Find and compare suppliers in over 70,000 categories. Our team keeps listings up to date
                            and assists with strategic sourcing opportunities.
                        </p>
                        <Button variant="secondary" className="w-full sm:w-auto">
                            Discover Suppliers
                        </Button>
                    </div>

                    {/* Get an Instant Quote */}
                    <div className="text-center">
                        <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <DollarSign className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-white text-lg md:text-xl font-bold mb-4">Get an Instant Quote</h3>
                        <p className="text-white/80 mb-6">
                            Upload a CAD model to get a quote within seconds for CNC machining, 3D printing, sheet
                            metal fabrication, and more.
                        </p>
                        <Button variant="secondary" className="w-full sm:w-auto">
                            Get an Instant Quote
                        </Button>
                    </div>

                    {/* Register as a Buyer */}
                    <div className="text-center sm:col-span-2 md:col-span-1">
                        <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <DollarSign className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-white text-lg md:text-xl font-bold mb-4">Register as a Buyer</h3>
                        <p className="text-white/80 mb-6">
                            Registered buyers can contact and quote with multiple suppliers, check out with a quote,
                            and pay on terms within one platform.
                        </p>
                        <Button variant="secondary" className="w-full sm:w-auto">
                            Register as a Buyer
                        </Button>
                    </div>
                </div>
            </div>

            {/* Client Carousel */}
            <div className="py-16 bg-white/5">
                <div className="container mx-auto px-4">
                    <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center mb-12">
                        Trusted by Industry Leaders
                    </h2>
                </div>
                <div className="relative overflow-hidden">
                    <div className="flex animate-scroll">
                        {[...Array(2)].map((_, groupIndex) => (
                            <div key={groupIndex} className="flex min-w-full justify-around items-center gap-4 md:gap-8 px-4">
                                {[...Array(6)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-center bg-white/10 rounded-lg p-4 md:p-6 min-w-[120px] md:min-w-[200px] h-16 md:h-24"
                                        aria-label={`Client logo ${index + 1}`}
                                    >
                                        <div className="text-white/80 text-sm md:text-base font-semibold">
                                            Company {index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 mt-16">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="text-white text-lg font-bold mb-4">About Us</h4>
                            <p className="text-white/60">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white text-lg font-bold mb-4">Quick Links</h4>
                            <div className="flex flex-col gap-2">
                                <Link href="#" className="text-white/60 hover:text-white">
                                    Home
                                </Link>
                                <Link href="#" className="text-white/60 hover:text-white">
                                    Features
                                </Link>
                                <Link href="#" className="text-white/60 hover:text-white">
                                    Pricing
                                </Link>
                                <Link href="#" className="text-white/60 hover:text-white">
                                    Contact
                                </Link>
                            </div>
                        </div>
                        <div className="sm:col-span-2 md:col-span-2">
                            <h4 className="text-white text-lg font-bold mb-4">Follow Us</h4>
                            <div className="flex gap-4">
                                <Link href="#" className="text-white/60 hover:text-white">
                                    Facebook
                                </Link>
                                <Link href="#" className="text-white/60 hover:text-white">
                                    Instagram
                                </Link>
                                <Link href="#" className="text-white/60 hover:text-white">
                                    Twitter
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 text-center text-white/60">
                        © 2023 Your Company Name. All rights reserved.
                    </div>
                </div>
            </footer>

            <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
        </div>
    )
}