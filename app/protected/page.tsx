import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { InfoIcon } from "lucide-react";


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

    const name = user?.user_metadata?.name || 'User';
    const email = user?.email || 'Not provided';
    const phone = user?.user_metadata?.phone_number || 'Not provided';
    const lastSignIn = formatDate(user?.last_sign_in_at);
    const accountCreated = formatDate(user?.created_at);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col items-center">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`} alt={name} />
                        <AvatarFallback>{name.split(' ').map((n: any[]) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4 text-2xl font-bold">{name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900">{email}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                            <dd className="mt-1 text-sm text-gray-900">{phone}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Last Sign In</dt>
                            <dd className="mt-1 text-sm text-gray-900">{lastSignIn}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                            <dd className="mt-1 text-sm text-gray-900">{accountCreated}</dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>
        </div>
    )
}