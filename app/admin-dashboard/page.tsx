'use client'

// types.ts
interface Organization {
    id: number;
    name: string;
}

interface BaseItem {
    id: number;
    organization_id: number;
}

interface Category extends BaseItem {
    category: string;
}

interface SubCategory extends BaseItem {
    sub_category: string;
}

interface ComplianceStandard extends BaseItem {
    standard: string;
}

interface FormData {
    organization_id: string;
    category: string;
    sub_category: string;
    standard: string;
}

type TabType = 'categories' | 'subcategories' | 'standards';

// AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const AdminDashboard: React.FC = () => {
    // State management
    const [activeTab, setActiveTab] = useState<TabType>('categories');
    const [organizations, setOrganizations] = useState<Organization[]>([
        { id: 1, name: 'Org 1' },
        { id: 2, name: 'Org 2' }
    ]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [standards, setStandards] = useState<ComplianceStandard[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<BaseItem | null>(null);
    const [formData, setFormData] = useState<FormData>({
        organization_id: '',
        category: '',
        sub_category: '',
        standard: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    // Form handling
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (value: string, field: keyof FormData): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const fetchData = async () => {
        const { data: categoriesData } = await supabase
            .from('organization_categories')
            .select('*');
        if (categoriesData) setCategories(categoriesData);

        const { data: subCategoriesData } = await supabase
            .from('organization_sub_categories')
            .select('*');
        if (subCategoriesData) setSubCategories(subCategoriesData);

        const { data: standardsData } = await supabase
            .from('compliance_standards')
            .select('*');
        if (standardsData) setStandards(standardsData);
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        try {
            const data = {
                organization_id: parseInt(formData.organization_id),
                [activeTab.slice(0, -1)]: formData[activeTab.slice(0, -1) as keyof FormData]
            };

            let { error } = await supabase
                .from(activeTab)  // 'categories', 'subcategories', or 'standards'
                .upsert([{
                    ...data,
                    id: currentItem?.id // if updating
                }]);

            if (error) throw error;

            console.log("Active Tab is: ",activeTab)

            // Refresh data
            fetchData();

            // Reset form
            setIsDialogOpen(false);
            setCurrentItem(null);
            setFormData({
                organization_id: '',
                category: '',
                sub_category: '',
                standard: ''
            });

        } catch (error) {
            console.error('Error inserting/updating data:', error);
            // Add error handling UI feedback here
        }
    };

    const handleDelete = (id: number): void => {
        // Here you would typically make DELETE API call to Supabase
        console.log('Deleting item:', id);
    };

    const handleEdit = (item: BaseItem): void => {
        setCurrentItem(item);
        setFormData({
            ...formData,
            organization_id: item.organization_id.toString(),
            ...(('category' in item) && { category: (item as Category).category }),
            ...(('sub_category' in item) && { sub_category: (item as SubCategory).sub_category }),
            ...(('standard' in item) && { standard: (item as ComplianceStandard).standard })
        });
        setIsDialogOpen(true);
    };

    // Render form based on active tab
    const renderForm = (): JSX.Element => {
        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Select
                        value={formData.organization_id}
                        onValueChange={(value) => handleSelectChange(value, 'organization_id')}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                            {organizations.map(org => (
                                <SelectItem key={org.id} value={org.id.toString()}>
                                    {org.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {activeTab === 'categories' && (
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            maxLength={50}
                            required
                        />
                    </div>
                )}

                {activeTab === 'subcategories' && (
                    <div className="space-y-2">
                        <Label htmlFor="sub_category">Sub Category</Label>
                        <Input
                            id="sub_category"
                            name="sub_category"
                            value={formData.sub_category}
                            onChange={handleInputChange}
                            maxLength={50}
                            required
                        />
                    </div>
                )}

                {activeTab === 'standards' && (
                    <div className="space-y-2">
                        <Label htmlFor="standard">Compliance Standard</Label>
                        <Input
                            id="standard"
                            name="standard"
                            value={formData.standard}
                            onChange={handleInputChange}
                            maxLength={100}
                            required
                        />
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        {currentItem ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        );
    };

    // Table column interface
    interface Column {
        header: string;
        key: string;
    }

    // Render table based on active tab
    const renderTable = (): JSX.Element => {
        const getTableData = (): (Category | SubCategory | ComplianceStandard)[] => {
            switch (activeTab) {
                case 'categories':
                    return categories;
                case 'subcategories':
                    return subCategories;
                case 'standards':
                    return standards;
                default:
                    return [];
            }
        };

        const getColumns = (): Column[] => {
            const commonColumns: Column[] = [
                { header: 'Organization', key: 'organization_id' },
                { header: 'Actions', key: 'actions' }
            ];

            switch (activeTab) {
                case 'categories':
                    return [
                        ...commonColumns.slice(0, -1),
                        { header: 'Category', key: 'category' },
                        commonColumns[commonColumns.length - 1]
                    ];
                case 'subcategories':
                    return [
                        ...commonColumns.slice(0, -1),
                        { header: 'Sub Category', key: 'sub_category' },
                        commonColumns[commonColumns.length - 1]
                    ];
                case 'standards':
                    return [
                        ...commonColumns.slice(0, -1),
                        { header: 'Standard', key: 'standard' },
                        commonColumns[commonColumns.length - 1]
                    ];
                default:
                    return commonColumns;
            }
        };

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {getColumns().map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {getTableData().map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {organizations.find(org => org.id === item.organization_id)?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {(item as any)[activeTab.slice(0, -1)] || (item as ComplianceStandard).standard}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {getTableData().length === 0 && (
                            <tr>
                                <td
                                    colSpan={getColumns().length}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                    <CardDescription>
                        Manage categories, sub-categories, and compliance standards
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as TabType)}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="categories">Categories</TabsTrigger>
                            <TabsTrigger value="subcategories">Sub Categories</TabsTrigger>
                            <TabsTrigger value="standards">Compliance Standards</TabsTrigger>
                        </TabsList>

                        <div className="mb-4">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className='bg-[#7AB80E] hover:bg-[#8BC727] text-white text-sm md:text-base'>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add New {activeTab.slice(0, -1)}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {currentItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
                                        </DialogTitle>
                                    </DialogHeader>
                                    {renderForm()}
                                </DialogContent>
                            </Dialog>
                        </div>

                        {renderTable()}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;