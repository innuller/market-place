'use client'

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Organization } from "@/types/types";
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge,badgeVariants,BadgeProps} from "@/components/ui/badge"
import {Dialog,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogOverlay,DialogPortal,DialogTitle,DialogTrigger } from "@/components/ui/dialog"
import {Table,TableBody,TableCaption,TableCell,TableFooter,TableHead,TableHeader,TableRow} from "@/components/ui/table"

const AdminDashboard: React.FC = () => {
    
    const supabase = createClient();

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

    useEffect(() => {
        const fetchPendingOrganizations = async () => {
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

        const { error } = await supabase
            .from("organizations_main")
            .update({ status })
            .eq("id", selectedOrg.id);

        if (error) {
            console.error(`Error updating organization status: ${error.message}`);
        } else {
            setOrganizations(organizations.filter((org) => org.id !== selectedOrg.id));
        }
        setConfirmDialogOpen(false);
        setSelectedOrg(null);
    };

    const openConfirmDialog = (org: Organization, action: "approve" | "reject") => {
        setSelectedOrg(org);
        setActionType(action);
        setConfirmDialogOpen(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Pending Organization Approvals</h1>

            {organizations.length === 0 ? (
                <p>No pending approvals</p>
            ) : (
                <div className="overflow-x-auto">
                    {/* Responsive Table for Desktop */}
                    <Table className="hidden md:block">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Organization Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {organizations.map((org) => (
                                <TableRow key={org.id}>
                                    <TableCell>{org.organization_name}</TableCell>
                                    <TableCell>{org.email}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="default"
                                            onClick={() => openConfirmDialog(org, "approve")}
                                            className="mr-2"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => openConfirmDialog(org, "reject")}
                                        >
                                            Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Cards for Mobile */}
                    <div className="md:hidden">
                        {organizations.map((org) => (
                            <Card key={org.id} className="mb-4">
                                <CardHeader>
                                    <CardTitle>{org.organization_name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{org.email}</p>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button
                                        variant="default"
                                        onClick={() => openConfirmDialog(org, "approve")}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => openConfirmDialog(org, "reject")}
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
                    <h3 className="font-bold text-lg">
                        {actionType === "approve"
                            ? `Approve ${selectedOrg?.organization_name}?`
                            : `Reject ${selectedOrg?.organization_name}?`}
                    </h3>
                    <p>
                        Are you sure you want to{" "}
                        {actionType === "approve" ? "approve" : "reject"} this organization?
                    </p>
                </DialogContent>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setConfirmDialogOpen(false)}
                        className="mr-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={actionType === "approve" ? "default" : "destructive"}
                        onClick={() =>
                            actionType === "approve"
                                ? updateOrganizationStatus("approved")
                                : updateOrganizationStatus("rejected")
                        }
                    >
                        {actionType === "approve" ? "Approve" : "Reject"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default AdminDashboard;
