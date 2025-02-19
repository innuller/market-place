//@ts-nocheck

'use client'

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Organization } from "@/types/types";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { redirect } from "next/navigation";

// New component for displaying metadata
const MetadataDisplay: React.FC<{ metadata: any }> = ({ metadata }) => {
  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === 'object' && item !== null) {
          return Object.entries(item)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
        }
        return String(item);
      }).join('; ');
    } else if (typeof value === 'object' && value !== null) {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${formatValue(v)}`)
        .join(', ');
    }
    return String(value);
  };

  const formatKey = (key: string): string => {
    return key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  return (
    <div className="space-y-2">
      {Object.entries(metadata).map(([key, value]) => (
        <div key={key} className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">{formatKey(key)}:</span>{" "}
          <span>{formatValue(value)}</span>
          {/* {formatKey == null ?}  */}
          <span>{formatValue(value)}</span>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
    const supabase = createClient();

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());

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
    }, [supabase]);

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

    const toggleExpand = (orgId: string) => {
        setExpandedOrgs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orgId)) {
                newSet.delete(orgId);
            } else {
                newSet.add(orgId);
            }
            return newSet;
        });
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
                <div className="space-y-4">
                    {organizations.map((org) => (
                        <Card key={org.id}>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>{org.organization_name}</CardTitle>
                                        <CardDescription>{org.email}</CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleExpand(org.id)}
                                    >
                                        {expandedOrgs.has(org.id) ? (
                                            <>
                                                <ChevronUp className="h-4 w-4 mr-2" />
                                                Contract
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="h-4 w-4 mr-2" />
                                                Expand
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                            {expandedOrgs.has(org.id) && (
                                <CardContent>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-medium">Phone</TableCell>
                                                <TableCell>{org.phone}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Address</TableCell>
                                                <TableCell>{org.address}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Website</TableCell>
                                                <TableCell>{org.website}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Created At</TableCell>
                                                <TableCell>{new Date(org.created_at).toLocaleString()}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Updated At</TableCell>
                                                <TableCell>{new Date(org.updated_at).toLocaleString()}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                                        <MetadataDisplay metadata={org.metadata} />
                                    </div>
                                </CardContent>
                            )}
                            <CardFooter className="flex justify-end space-x-2">
                                <Button
                                    className="bg-green-600 hover:bg-green-500"
                                    onClick={() => openConfirmDialog(org, "approve")}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => openConfirmDialog(org, "reject")}
                                >
                                    Reject
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
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