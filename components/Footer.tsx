import Link from "next/link"
import * as React from "react"
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react"

export function FooterComponent() {


    return (
        <>
            {/* Footer */}
            <footer className="border-t border-white/10 mt-16">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="text-white text-lg font-bold mb-4">About Us</h4>
                            <p className="text-white/60">
                                Search and Buy with The Leading Industries Exploration Platform.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white text-lg font-bold mb-4">Quick Links</h4>
                            <div className="flex flex-col gap-2">
                                <Link href="/" className="text-white/60 hover:text-white">
                                    Home
                                </Link>
                                <Link href="/about" className="text-white/60 hover:text-white">
                                    About Us
                                </Link>
                                <Link href="/terms-conditions" className="text-white/60 hover:text-white">
                                    Terms and Conditions
                                </Link>
                                <Link href="/privacy-policy" className="text-white/60 hover:text-white">
                                    Privacy Policy
                                </Link>
                                <Link href="/contact-us" className="text-white/60 hover:text-white">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                        <div className="sm:col-span-2 md:col-span-2">
                            <h4 className="text-white text-lg font-bold mb-4">Follow Us</h4>
                            <div className="flex gap-4">
                                <Link href="#" className="text-white/60 hover:text-white">
                                    <Facebook />
                                </Link>
                                <Link href="Https://www.instagram.com/innuller/" className="text-white/60 hover:text-white">
                                    <Instagram />
                                </Link>
                                <Link href="https://x.com/innuller" className="text-white/60 hover:text-white">
                                    <Twitter />
                                </Link>
                                <Link href="https://www.linkedin.com/company/innuller/" className="text-white/60 hover:text-white">
                                    <Linkedin />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 text-center text-white/60">
                        © 2025 Innuller. All rights reserved.
                    </div>
                    <div className="mt-2 text-center text-white/60">
                        Website last modified on 18/04/2025
                    </div>
                </div>
            </footer>
        </>
    )
}
