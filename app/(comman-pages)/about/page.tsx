import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003853] to-[#002538] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-8 text-center">About innuller</h1>
        
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-[#7AB80E]">Who we are</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <p className="mb-4 text-lg">We are fast growing marketplace and a one-stop expert solution for all business needs, empowering suppliers by connecting them buyers across the nation.</p>
              <p className="text-lg">At the heart of Innuller is our commitment to creating value for Indian business communities through strong network effects. We make business effortless for all by ensuring access to a wider market, technology, and finance.</p>
            </div>
            <div className="md:w-1/2">
              <Image 
                src="/images/i/Who we are.jpeg" 
                alt="Business network illustration" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-[#7AB80E]">What we do</h2>
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/2">
              <p className="mb-4 text-lg">With a focus on digital and financial inclusion, we empower businesses of all sizes by providing seamless access to a vast digital marketplace. Our platform allows suppliers to begin their online journey effortlessly, offering a comprehensive suite of tools and services designed to help them grow and succeed.</p>
              <Card className="bg-[#004b6e] border-[#7AB80E] mb-4">
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-[#7AB80E]">Key Benefits</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#7AB80E]">
                    <li>Enhanced business visibility</li>
                    <li>Increased brand credibility</li>
                    <li>Efficient lead management</li>
                  </ul>
                </CardContent>
              </Card>
              <p className="text-lg">Buyers can easily explore a wide range of products and connect with verified suppliers, finding everything they need-from pins to planes-on a single platform.</p>
            </div>
            <div className="md:w-1/2">
              <Image 
                src="/images/i/Empowering business.jpg" 
                alt="Digital marketplace illustration" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-[#7AB80E]">How we do It</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <p className="mb-4 text-lg">We believe in empowering businesses with tech-powered solutions. Our innovative tools ensure quick and responsive connections between suppliers and buyers, thanks to our unique, data-driven algorithmic matchmaking. This further enables us to deliver tailored services that meet the specific needs of each business.</p>
              <p className="text-lg">By continually investing in AI, ML, and data analytics, we aim to improve the user experience. Features like Lead Manager, multi-language search & voice assistants, ratings & reviews, cloud-based applications, and lead generation system, ensure better user experience and promote ease of doing business.</p>
            </div>
            <div className="md:w-1/2">
              <Image 
                src="/images/i/Digital and Financial Inclusion.jpg" 
                alt="Tech solutions illustration" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-[#7AB80E]">Key Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Pan India presence: Services offered all over India across 100+ cities.",
              "Attractive value proposition for local MSMEs: Innuller's value-added offerings of huge online visibility, customized website, mobile site and mobile app; all packaged together, make it an attractive value proposition for MSMEs, several of whom have continuous associations with INNULLER.",
              "Local Expertise: With a strong and widespread sales force, years of experience and in-depth local market knowledge, Innuller enjoys significant expertise across all regions of the country.",
              "Long operating history with a proven monetization model.",
              "Experienced management team"
            ].map((highlight, index) => (
              <Card key={index} className="bg-[#004b6e] border-[#7AB80E]">
                <CardContent className="p-4">
                  <p className="text-lg text-white">{highlight}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-[#7AB80E]">Our Social Responsibility</h2>
          <p className="mb-4 text-lg">Social development is at the heart of our mission, empowering small businesses and individuals by democratizing access to a safer, digitized marketplace. Over the last two decades, this commitment has driven transformational change, reducing carbon footprints & paper usage through sustainable digital practices and creating job opportunities that uplift communities and improve livelihoods.</p>
          <p className="text-lg">With a mission to achieve long-term socio-economic development of the communities, we drive sustainable change in the fields of education, environment, and healthcare systems through our corporate social responsibility initiatives.</p>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6 text-[#7AB80E]">Join the Team</h2>
          <p className="mb-6 text-lg">At Innuller, we are always on the lookout for talented individuals who are willing to become a part of our success story. If you share our commitment to empowering businesses, contact us without hesitation on email id <u><Link href="mailto:contact@innullar.com" className="text-[#7AB80E]">contact@innuller.com</Link></u></p>
          {/* <Button className="bg-[#7AB80E] text-white px-8 py-3 rounded-lg text-lg hover:bg-[#63a029] transition-colors" onClick={() => window.open('mailto:contact@innullar.com ', '_blank')}>
            Mail Us
          </Button> */}
        </section>
      </div>
    </div>
  )
}
