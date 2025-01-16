import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { InfoIcon, Mail, Phone, Calendar, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserMetadata {
    name?: string;
    phone_number?: string;
}

interface UserData {
    email?: string;
    last_sign_in_at?: string;
    created_at?: string;
    user_metadata?: UserMetadata;
}

export default async function Component() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/signin");
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not available';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const name = `${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}` || 'User';
    const email = user?.email || 'Not provided';
    const phone = user?.user_metadata?.phone_number || 'Not provided';
    const lastSignIn = formatDate(user?.last_sign_in_at);
    const accountCreated = formatDate(user?.created_at);

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#003853] text-white">
            <Card className="w-full max-w-md bg-white/10 border-white/20">
                <CardHeader className="flex flex-col items-center pb-6 border-b border-white/10">
                    <Avatar className="w-24 h-24 border-4 border-[#7AB80E]">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`} alt={name} />
                        <AvatarFallback>{name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4 text-2xl font-bold text-[#7AB80E]">{name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <dl className="space-y-4">
                        <div className="flex items-center">
                            <Mail className="w-5 h-5 mr-3 text-[#7AB80E]" />
                            <div>
                                <dt className="text-sm font-medium text-white/60">Email</dt>
                                <dd className="mt-1 text-sm text-white">{email}</dd>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Phone className="w-5 h-5 mr-3 text-[#7AB80E]" />
                            <div>
                                <dt className="text-sm font-medium text-white/60">Phone</dt>
                                <dd className="mt-1 text-sm text-white">{phone}</dd>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 mr-3 text-[#7AB80E]" />
                            <div>
                                <dt className="text-sm font-medium text-white/60">Last Sign In</dt>
                                <dd className="mt-1 text-sm text-white">{lastSignIn}</dd>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-3 text-[#7AB80E]" />
                            <div>
                                <dt className="text-sm font-medium text-white/60">Account Created</dt>
                                <dd className="mt-1 text-sm text-white">{accountCreated}</dd>
                            </div>
                        </div>
                    </dl>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/protected/reset-password">
                        <Button className="hover:bg-[#7AB80E]">
                            Reset Password
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}