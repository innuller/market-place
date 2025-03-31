//@ts-nocheck

'use client'

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Organization } from "@/types/types";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/utils/cn"

// New component for displaying metadata
function MetadataDisplay({ metadata }: { metadata: Record<string, any> }) {
    const formatValue = (value: any, key: any): React.ReactNode => {
        // Function to detect URLs in text and convert them to clickable links
        const convertUrlsToLinks = (text: string) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const parts = text.split(urlRegex);

            return parts.map((part, index) => {
                if (part.match(urlRegex)) {
                    return (
                        <a
                            key={index}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 transition-colors relative z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(part, '_blank');
                            }}
                        >
                            {part}
                        </a>
                    );
                }
                return part;
            });
        };

        if (key === 'products_services' && Array.isArray(value)) {
            return (
                <div className="space-y-2">
                    {value.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="font-medium relative z-10">{item.name}</span>
                            {item.catalog ? (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(item.catalog, '_blank');
                                    }}
                                    className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer relative z-10"
                                >
                                    Preview Catalog
                                </button>
                            ) : (
                                <span className="text-gray-400 relative z-10">No catalog</span>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

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
                .map(([k, v]) => `${k}: ${formatValue(v, k)}`)
                .join(', ');
        }
        const stringValue = String(value);
        if (typeof value === 'string' && stringValue.match(/(https?:\/\/[^\s]+)/g)) {
            return convertUrlsToLinks(stringValue);
        }
        return stringValue;
    };

    const formatKey = (key: string): string => {
        return key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metadata).map(([key, value]) => (
                <div
                    key={key}
                    className="relative bg-white/5 backdrop-blur-sm border border-gray-200/10 p-4 rounded-lg shadow-sm
                     hover:shadow-md hover:border-gray-200/20 transition-all duration-200"
                >
                    <div className="relative z-10"/>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">{formatKey(key)}</h4>
                    {/* <p className="text-base font-semibold text-gray-900 break-words cursor-text"> */}
                    <div className="text-base font-semibold text-gray-900 break-words">
                        {formatValue(value, key)}
                    </div>
                    {/* </p> */}
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboard() {
    const supabase = createClient();

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [actionType, setActionType] = useState<"approve" | "reject" | "delete" | null>(null);
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
                // .neq("status", "deleted");

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

    const updateOrganizationStatus = async (status: "approved" | "rejected" | "deleted") => {
        if (!selectedOrg) return;

        setIsProcessing(true);
        
        if (status === "deleted" && selectedOrg.status === "deleted") {
            // Permanently delete the record
            const { error } = await supabase
                .from("organizations_main")
                .delete()
                .eq("id", selectedOrg.id);

            if (error) {
                console.error(`Error deleting organization: ${error.message}`);
                // TODO: Add error toast notification here
            } else {
                setOrganizations(organizations.filter((org) => org.id !== selectedOrg.id));
                // TODO: Add success toast notification here
            }
        } else {
            // Update status
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
            <h1 className="text-2xl font-bold">Organization Approvals Lists</h1>
            <ScrollArea className="h-[calc(100vh-8rem)]">
                {organizations.length === 0 ? (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-muted-foreground">No pending approvals</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {organizations.map((org) => (
                            <Card key={org.id} className={cn(
                                "relative overflow-hidden",
                                "hover:shadow-md transition-shadow duration-200"
                            )}>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-sm">Contact Information</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-muted-foreground">📞</span>
                                                        <span>{org.phone || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-start space-x-2">
                                                        <span className="text-muted-foreground">📍</span>
                                                        <span>{org.address || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-muted-foreground">🌐</span>
                                                        <Button
                                                            variant="link"
                                                            className="h-auto p-0"
                                                            onClick={() => window.open(org.website, '_blank')}
                                                        >
                                                            {org.website || 'N/A'}
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card> */}
                                            {/* <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-sm">Timestamps</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-muted-foreground">Created:</span>
                                                        <span>
                                                            {new Date(org.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-muted-foreground">Updated:</span>
                                                        <span>
                                                            {new Date(org.updated_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card> */}
                                        </div>
                                        <Separator className="my-6" />
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                                            <MetadataDisplay metadata={org.metadata} />
                                        </div>
                                    </CardContent>
                                )}
                                <CardFooter className="flex justify-end space-x-2">
                                    {(org.status === "approved" || org.status === "deleted") && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => openConfirmDialog(org, "delete")}
                                            className="hover:bg-destructive hover:text-destructive-foreground"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {(!org.status || org.status === "pending") && (
                                        <>
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
                                        </>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === "approve"
                                ? `Approve ${selectedOrg?.organization_name}`
                                : actionType === "reject"
                                ? `Reject ${selectedOrg?.organization_name}`
                                : `Delete ${selectedOrg?.organization_name}`}
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {actionType === "approve" ? "approve" : actionType === "reject" ? "reject" : "delete"} this organization?
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
                            onClick={() => updateOrganizationStatus(actionType === "approve" ? "approved" : actionType === "reject" ? "rejected" : "deleted")}
                            disabled={isProcessing}
                        >
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {actionType === "approve" ? "Approve" : actionType === "reject" ? "Reject" : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}