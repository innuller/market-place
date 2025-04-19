'use client'

import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003853] to-[#002538] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-12 text-center text-[#7AB80E]">Contact Us</h1>

        {/* Only Reach Us Info */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-16">
          <Card className="bg-[#004b6e] border-[#7AB80E]">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-[#7AB80E] mb-4">Reach Us At</h2>
              <p className="text-lg">📍 <strong>Address:</strong> 86, IDSMT, Jaipur – 303901</p>
              <p className="text-lg">📞 <strong>Phone:</strong> +91-9829337793</p>
              <p className="text-lg">
                ✉️ <strong>Email:</strong>{' '}
                <Link href="mailto:contact@innuller.com" className="text-[#7AB80E] hover:underline">
                  contact@innuller.com
                </Link>
              </p>
              <p className="text-lg">🌐 <strong>Website:</strong> https://www.innuller.com</p>
            </CardContent>
          </Card>
        </div>

        {/* Full Width Map */}
        <div className="w-full rounded-lg overflow-hidden shadow-lg border border-[#7AB80E]">
          <iframe
            src="https://maps.google.com/maps?q=Noida&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="450"
            loading="lazy"
            className="w-full"
            allowFullScreen
            style={{ border: '0' }}
          ></iframe>
        </div>
      </div>
    </div>
  )
}
