import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003853] to-[#002538] text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        <Card className="bg-[#004b6e] border-[#7AB80E]">
          <CardContent className="p-6">
            <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-[#7AB80E]">Introduction</h2>
                  <p className="text-lg">We respect your privacy rights and recognize the importance of secure transactions and information privacy. This Privacy Policy describes how XXXX Pvt. Ltd. and its affiliates (collectively "XXXX, we, our, us") collect, use, share or otherwise process your personal information through XXXX website www.XXXX.com, its mobile application, and m-site (hereinafter referred to as the "Platform").</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-[#7AB80E]">Application of Policy</h2>
                  <p className="text-lg">This policy governs each website, mobile site, application, and/or other service, regardless of how distributed, transmitted, published, or broadcast ("Service") provided by XXXX Pvt. Ltd. and/or its affiliates ("we," "us," or "our" or "XXXX") that links to this policy, which is binding on all those who access, visit and/or use XXXX's Services.</p>
                </section>

                {/* Add more sections here, following the structure of the provided privacy policy */}

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-[#7AB80E]">Contact Information</h2>
                  <p className="text-lg mb-4">If you have any questions or concerns about our privacy practices, please contact our Grievance Officer:</p>
                  <Card className="bg-[#003853] border-[#7AB80E]">
                    <CardContent className="p-4">
                      <p className="mb-2"><strong>Name:</strong> Mr. XXXX</p>
                      <p className="mb-2"><strong>Address:</strong> XXXX Pvt. Ltd., Address</p>
                      <p className="mb-2"><strong>Contact No:</strong> xxxxxxx</p>
                      <p><strong>Email:</strong> xxxx@XXXX.com</p>
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