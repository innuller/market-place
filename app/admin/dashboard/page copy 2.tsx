'use client'

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Organization } from "@/types/types";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

const AdminDashboard: React.FC = () => {
    const supabase = createClient();

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        const fetchPendingOrganizations = async () => {

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                return redirect("/signin");
            }

            setLoading(true);
            const { data, error } = await supabase
                .from("organizations_main")
                .select("*")
                .eq("status", "pending");

            if (error) {
                setError("Error fetching pending organizations");
                console.error(error);
            } else {
                setOrganizations(data ?? []);
            }
            setLoading(false);
        };

        fetchPendingOrganizations();
    }, []);

    const updateOrganizationStatus = async (status: "approved" | "rejected") => {
        if (!selectedOrg) return;

        setIsProcessing(true);
        const { error } = await supabase
            .from("organizations_main")
            .update({ status })
            .eq("id", selectedOrg.id);

        if (error) {
            console.error(`Error updating organization status: ${error.message}`);
            // TODO: Add error toast notification here
        } else {
            setOrganizations(organizations.filter((org) => org.id !== selectedOrg.id));
            // TODO: Add success toast notification here
        }
        setIsProcessing(false);
        setConfirmDialogOpen(false);
        setSelectedOrg(null);
    };

    const openConfirmDialog = (org: Organization, action: "approve" | "reject") => {
        setSelectedOrg(org);
        setActionType(action);
        setConfirmDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Pending Organization Approvals</h1>

            {organizations.length === 0 ? (
                <Card>
                    <CardContent className="py-8">
                        <p className="text-center text-muted-foreground">No pending approvals</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="overflow-x-auto">
                    {/* Desktop Table View */}
                    <Table className="hidden md:table">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Organization Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="w-[200px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {organizations.map((org) => (
                                <TableRow key={org.id}>
                                    <TableCell className="font-medium">{org.organization_name}</TableCell>
                                    <TableCell>{org.email}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                // variant="default"
                                                className="bg-green-600 hover:bg-green-500"
                                                size="sm"
                                                onClick={() => openConfirmDialog(org, "approve")}
                                                aria-label={`Approve ${org.organization_name}`}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => openConfirmDialog(org, "reject")}
                                                aria-label={`Reject ${org.organization_name}`}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Mobile Card View */}
                    <div className="grid gap-4 md:hidden">
                        {organizations.map((org) => (
                            <Card key={org.id}>
                                <CardHeader>
                                    <CardTitle>{org.organization_name}</CardTitle>
                                    <CardDescription>{org.email}</CardDescription>
                                </CardHeader>
                                <CardFooter className="flex gap-2">
                                    <Button
                                        className="flex-1"
                                        variant="default"
                                        onClick={() => openConfirmDialog(org, "approve")}
                                        aria-label={`Approve ${org.organization_name}`}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        variant="destructive"
                                        onClick={() => openConfirmDialog(org, "reject")}
                                        aria-label={`Reject ${org.organization_name}`}
                                    >
                                        Reject
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === "approve"
                                ? `Approve ${selectedOrg?.organization_name}`
                                : `Reject ${selectedOrg?.organization_name}`}
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {actionType === "approve" ? "approve" : "reject"} this organization?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDialogOpen(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={actionType === "approve" ? "default" : "destructive"}
                            onClick={() => updateOrganizationStatus(actionType === "approve" ? "approved" : "rejected")}
                            disabled={isProcessing}
                        >
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {actionType === "approve" ? "Approve" : "Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminDashboard;