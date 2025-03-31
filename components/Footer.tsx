import Link from "next/link"
import * as React from "react"

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
        </>
    )
}