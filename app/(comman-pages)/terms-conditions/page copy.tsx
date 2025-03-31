import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003853] to-[#002538] text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms and Conditions of Use</h1>
        <Card className="bg-[#004b6e] border-[#7AB80E]">
          <CardContent className="p-6">
            <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
              <div className="space-y-8">
                <p className="font-semibold text-xl text-[#7AB80E] mb-4">PLEASE READ THE FOLLOWING TERMS AND CONDITIONS OF USE AGREEMENT CAREFULLY</p>
                
                <p className="text-lg mb-4">The following agreement captures the terms and conditions of use ("Agreement"), applicable to Your use of XXXX.com ("Web Site"), which promotes business between suppliers and buyers globally. It is an agreement between You as the user of the Web Site/XXXX PVT. LTD. Services and XXXX, xxx Pvt. Ltd.. The expressions "You" "Your" or "User(s)" refers to any person who accesses or uses the Web Site for any purpose.</p>

                <p className="text-lg mb-4">By subscribing to or interacting with other User(s) on or entering into negotiations in respect of sale or supply of goods or services on or using the Web Site or XXX Pvt. Ltd. in any manner for any purpose, You undertake and agree that You have fully read, understood and accepted the Agreement.</p>

                <p className="text-lg mb-8">If You do not agree to or do not wish to be bound by the Agreement, You may not access or otherwise use the Web Site in any manner.</p>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-[#7AB80E]">I. Web site-Merely a Venue/Platform</h2>
                  <Card className="bg-[#003853] border-[#7AB80E]">
                    <CardContent className="p-4">
                      <p className="text-lg">The Web Site acts as a match-making platform for User(s) to negotiate and interact with other User(s) for entering into negotiations in respect thereof for sale or supply of goods or services. XXXX PVT. LTD. or XXXX.com are not parties to any negotiations that take place between the User(s) of the Web Site and are further not parties to any agreement including an agreement for sale or supply of goods or services or otherwise, concluded between the User(s) of the Web Site.</p>
                    </CardContent>
                  </Card>
                </section>

                {/* Add more sections here, following the structure of the provided terms and conditions */}

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-[#7AB80E]">XVIII. Pharmaceutical Product/Service Policies</h2>
                  <Card className="bg-[#003853] border-[#7AB80E]">
                    <CardContent className="p-4">
                      <p className="text-lg">The Web Site does not facilitate the purchase of pharmaceutical products, and only advertises and/or showcases the pharmaceutical products posted by Users(s). User(s) involved in the purchase and supply of pharmaceutical products hereby agree to abide by and be compliant of any applicable laws, rules, regulations, notifications or orders issued by the Government of India or any of its agencies from time to time in this regard including but not limited to Drugs and Cosmetics Act, 1940, Drugs and Cosmetics Rules, 1945 ("Drug Rules"), Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954 ("Drug and Magic Remedies Act").</p>
                    </CardContent>
                  </Card>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}