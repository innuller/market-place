import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from 'lucide-react';

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#003853] text-white">
      <Card className="w-full max-w-md bg-white/10 border-white/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Reset Password</CardTitle>
          <p className="text-sm text-center text-white/60">
            Enter your email to receive a password reset link
          </p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>
            <SubmitButton formAction={forgotPasswordAction} className="w-full bg-[#7AB80E] hover:bg-[#63a029] text-white">
              Send Reset Link
            </SubmitButton>
          </form>
          <FormMessage message={searchParams} />
          <div className="mt-4 text-center text-sm">
            <Link className="text-[#7AB80E] hover:underline" href="/auth">
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}