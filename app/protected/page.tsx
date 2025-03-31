'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { InfoIcon, Mail, Phone, Calendar, Clock, Percent, Edit2, Save, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface UserMetadata {
    name?: string;
    phone_number?: string;
    first_name?: string;
    last_name?: string;
    gst_number?: string;
}

interface UserData {
    email?: string;
    last_sign_in_at?: string;
    created_at?: string;
    user_metadata?: UserMetadata;
}

export default function Component() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState<{[key: string]: boolean}>({});
    const [formData, setFormData] = useState<{[key: string]: string}>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error.message);
                return redirect("/signin");
            }
            if (user) {
                setUser(user);
                setFormData({
                    gst_number: user.user_metadata?.gst_number || ''
                });
            }
            setLoading(false);
        };
        getUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

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

    const handleEdit = (field: string) => {
        setEditMode({ ...editMode, [field]: true });
        setFormData({ ...formData, [field]: user[field] || user.user_metadata?.[field] || '' });
    };

    const handleCancel = (field: string) => {
        setEditMode({ ...editMode, [field]: false });
        setError(null);
    };

    const handleSave = async (field: string) => {
        try {
            if (field === 'gst_number') {
                const { error } = await supabase.auth.updateUser({
                    data: { [field]: formData[field] }
                });
                if (error) throw error;
                setUser({
                    ...user,
                    user_metadata: {
                        ...user.user_metadata,
                        [field]: formData[field]
                    }
                });
                setEditMode({ ...editMode, [field]: false });
                setError(null);
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const name = `${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}` || 'User';
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
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <dl className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center flex-grow">
                                <Mail className="w-5 h-5 mr-3 text-[#7AB80E]" />
                                <div className="flex-grow">
                                    <dt className="text-sm font-medium text-white/60">Email</dt>
                                    <dd className="mt-1 text-sm text-white">{user.email}</dd>
                                </div>
                            </div>
                            {/* <div className="flex ml-2">
                                {editMode.email ? (
                                    <>
                                        <Button
                                            onClick={() => handleSave('email')}
                                            size="sm"
                                            className="mr-1 bg-[#7AB80E] hover:bg-[#8BC727]"
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() => handleCancel('email')}
                                            size="sm"
                                            variant="destructive"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => handleEdit('email')}
                                        size="sm"
                                        className="bg-transparent hover:bg-white/10"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div> */}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center flex-grow">
                                <Percent className="w-5 h-5 mr-3 text-[#7AB80E]" />
                                <div className="flex-grow">
                                    <dt className="text-sm font-medium text-white/60">GST</dt>
                                    {editMode.gst_number ? (
                                        <Input
                                            value={formData.gst_number}
                                            onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                                            className="mt-1 bg-white/10 border-white/20 text-white"
                                        />
                                    ) : (
                                        <dd className="mt-1 text-sm text-white">{user.user_metadata?.gst_number}</dd>
                                    )}
                                </div>
                            </div>
                            <div className="flex ml-2">
                                {editMode.gst_number ? (
                                    <>
                                        <Button
                                            onClick={() => handleSave('gst_number')}
                                            size="sm"
                                            className="mr-1 bg-[#7AB80E] hover:bg-[#8BC727]"
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() => handleCancel('gst_number')}
                                            size="sm"
                                            variant="destructive"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => handleEdit('gst_number')}
                                        size="sm"
                                        className="bg-transparent hover:bg-white/10"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                )}
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
    );
}