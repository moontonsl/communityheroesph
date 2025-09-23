import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ToastContainer, useToast } from '@/components/ui/toast';
import { Plus, Edit, Trash2, Shield, ShieldCheck, ShieldX, Key, Search, ChevronLeft, ChevronRight, Users, Settings, FileText, BarChart } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Role {
    id: number;
    name: string;
    slug: string;
    description?: string;
    permissions: string[];
    is_active: boolean;
    users_count: number;
    created_at: string;
}

interface PermissionGroup {
    [key: string]: string;
}

interface AvailablePermissions {
    [category: string]: PermissionGroup;
}

interface Props {
    roles: {
        data: Role[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    availablePermissions: AvailablePermissions;
}

export default function RoleManagement({ roles, availablePermissions }: Props) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRoles, setFilteredRoles] = useState(roles.data);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    const createForm = useForm({
        name: '',
        description: '',
        permissions: [] as string[],
        is_active: true,
    });

    const editForm = useForm({
        name: '',
        description: '',
        permissions: [] as string[],
        is_active: true,
    });

    // Filter roles based on search query
    useEffect(() => {
        const filtered = roles.data.filter(role => 
            role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            role.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (role.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        );
        setFilteredRoles(filtered);
    }, [searchQuery, roles.data]);

    const handleCreateRole = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/roles', {
            onSuccess: () => {
                setCreateModalOpen(false);
                createForm.reset();
                showSuccess('Role Created', 'The role has been created successfully.');
            },
            onError: (errors) => {
                showError('Creation Failed', 'Failed to create role. Please check the form and try again.');
            },
        });
    };

    const handleEditRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;
        
        // Ensure we have at least one permission selected
        if (editForm.data.permissions.length === 0) {
            editForm.setError('permissions', 'At least one permission must be selected');
            return;
        }
        

        
        editForm.put(`/admin/roles/${selectedRole.id}`, {
            onSuccess: () => {
                setEditModalOpen(false);
                setSelectedRole(null);
                editForm.reset();
                showSuccess('Role Updated', 'The role has been updated successfully.');
            },
            onError: (errors) => {
                showError('Update Failed', 'Failed to update role. Please check the form and try again.');
            },
        });
    };

    const openEditModal = (role: Role) => {
        setSelectedRole(role);
        editForm.setData({
            name: role.name,
            description: role.description || '',
            permissions: role.permissions,
            is_active: role.is_active,
        });
        setEditModalOpen(true);
    };

    const openDeleteModal = (role: Role) => {
        setSelectedRole(role);
        setDeleteModalOpen(true);
    };

    const toggleRoleStatus = (role: Role) => {
        router.patch(`/admin/roles/${role.id}/toggle-status`, {}, {
            onSuccess: () => {
                const status = role.is_active ? 'deactivated' : 'activated';
                showSuccess('Status Updated', `Role has been ${status} successfully.`);
            },
            onError: () => {
                showError('Status Update Failed', 'Failed to update role status. Please try again.');
            },
        });
    };

    const deleteRole = () => {
        if (!selectedRole) return;
        router.delete(`/admin/roles/${selectedRole.id}`, {
            onSuccess: () => {
                showSuccess('Role Deleted', 'The role has been deleted successfully.');
            },
            onError: () => {
                showError('Deletion Failed', 'Failed to delete role. Please try again.');
            },
        });
        setDeleteModalOpen(false);
        setSelectedRole(null);
    };

    const getRoleBadgeVariant = (roleSlug: string) => {
        switch (roleSlug) {
            case 'super-admin':
                return 'destructive';
            case 'community-admin':
                return 'default';
            case 'barangay-representative':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'users':
                return Users;
            case 'roles':
                return Shield;
            case 'submissions':
                return FileText;
            case 'reports':
                return BarChart;
            case 'settings':
            case 'system':
                return Settings;
            default:
                return Key;
        }
    };

    const handlePermissionChange = (permission: string, checked: boolean, form: any) => {
        const currentPermissions = form.data.permissions;
        if (checked) {
            form.setData('permissions', [...currentPermissions, permission]);
        } else {
            form.setData('permissions', currentPermissions.filter((p: string) => p !== permission));
        }
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/roles', { page }, { preserveState: true });
    };

    const getTotalPermissions = () => {
        return Object.values(availablePermissions).reduce((total, group) => total + Object.keys(group).length, 0);
    };

    return (
        <AppLayout>
            <Head title="Role Management" />
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            <div className="space-y-8 p-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Role Management</h1>
                        <p className="text-muted-foreground">Manage user roles and permissions across the system</p>
                    </div>
                    
                    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="shadow-sm">
                                <Plus className="mr-2 h-5 w-5" />
                                Create Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader className="space-y-3">
                                <DialogTitle className="text-xl">Create New Role</DialogTitle>
                                <DialogDescription className="text-base">
                                    Create a new role with specific permissions and access levels.
                                </DialogDescription>
                            </DialogHeader>
                            
                            <form onSubmit={handleCreateRole} className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium">Role Name *</Label>
                                        <Input
                                            id="name"
                                            value={createForm.data.name}
                                            onChange={e => createForm.setData('name', e.target.value)}
                                            placeholder="Enter role name"
                                            className="h-10"
                                            required
                                        />
                                        {createForm.errors.name && (
                                            <p className="text-sm text-red-600">{createForm.errors.name}</p>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                        <Input
                                            id="description"
                                            value={createForm.data.description}
                                            onChange={e => createForm.setData('description', e.target.value)}
                                            placeholder="Enter role description"
                                            className="h-10"
                                        />
                                        {createForm.errors.description && (
                                            <p className="text-sm text-red-600">{createForm.errors.description}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <Label className="text-sm font-medium">Permissions *</Label>
                                    <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
                                        {Object.entries(availablePermissions).map(([category, permissions]) => {
                                            const IconComponent = getCategoryIcon(category);
                                            return (
                                                <div key={category} className="mb-6 last:mb-0">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                                                        <h4 className="font-medium text-sm capitalize">{category}</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                                                        {Object.entries(permissions).map(([permission, label]) => (
                                                            <div key={permission} className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`create-${permission}`}
                                                                    checked={createForm.data.permissions.includes(permission)}
                                                                    onChange={(e) => handlePermissionChange(permission, e.target.checked, createForm)}
                                                                    className="h-4 w-4 rounded border-gray-300"
                                                                />
                                                                <Label htmlFor={`create-${permission}`} className="text-sm cursor-pointer">
                                                                    {label}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {createForm.errors.permissions && (
                                        <p className="text-sm text-red-600">{createForm.errors.permissions}</p>
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="create_is_active"
                                            checked={createForm.data.is_active}
                                            onChange={e => createForm.setData('is_active', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="create_is_active" className="text-sm font-medium">Active Role</Label>
                                    </div>
                                    
                                    <div className="flex space-x-3">
                                        <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={createForm.processing}>
                                            {createForm.processing ? 'Creating...' : 'Create Role'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                
                {/* Roles Table Card */}
                <Card className="shadow-sm">
                    <CardHeader className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl">System Roles</CardTitle>
                                <CardDescription className="text-base">
                                    Manage all roles and their permissions in the system
                                </CardDescription>
                            </div>
                            
                            {/* Search Bar */}
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search roles by name or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="text-left p-4 font-medium">Role</th>
                                        <th className="text-left p-4 font-medium">Users</th>
                                        <th className="text-left p-4 font-medium">Permissions</th>
                                        <th className="text-left p-4 font-medium">Status</th>
                                        <th className="text-left p-4 font-medium">Created</th>
                                        <th className="text-right p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRoles.map((role, index) => (
                                        <tr key={role.id} className={`border-b hover:bg-muted/30 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium text-foreground">{role.name}</div>
                                                        <Badge variant={getRoleBadgeVariant(role.slug)} className="font-medium text-xs">
                                                            {role.slug}
                                                        </Badge>
                                                    </div>
                                                    {role.description && (
                                                        <div className="text-sm text-muted-foreground">{role.description}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{role.users_count}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Key className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{role.permissions.length}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={role.is_active ? 'default' : 'secondary'} className="font-medium">
                                                    {role.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {new Date(role.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => openEditModal(role)}
                                                        className="h-8 w-8 p-0"
                                                        title="Edit role"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => toggleRoleStatus(role)}
                                                        className="h-8 w-8 p-0"
                                                        title={role.is_active ? 'Deactivate role' : 'Activate role'}
                                                    >
                                                        {role.is_active ? (
                                                            <ShieldX className="h-4 w-4" />
                                                        ) : (
                                                            <ShieldCheck className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => openDeleteModal(role)}
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                        title="Delete role"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {filteredRoles.length === 0 && (
                            <div className="text-center py-12">
                                <div className="space-y-3">
                                    <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
                                    <div>
                                        <p className="text-lg font-medium">No roles found</p>
                                        <p className="text-muted-foreground">
                                            {searchQuery ? 'Try adjusting your search criteria' : 'No roles exist yet'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {roles.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
                                <div className="text-sm text-muted-foreground">
                                    Showing {roles.from} to {roles.to} of {roles.total} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(roles.current_page - 1)}
                                        disabled={roles.current_page === 1}
                                        className="h-8"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>
                                    
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(5, roles.last_page) }, (_, i) => {
                                            const page = roles.current_page <= 3 
                                                ? i + 1 
                                                : roles.current_page + i - 2;
                                            
                                            if (page > roles.last_page) return null;
                                            
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={page === roles.current_page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(roles.current_page + 1)}
                                        disabled={roles.current_page === roles.last_page}
                                        className="h-8"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Role Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl">Edit Role</DialogTitle>
                        <DialogDescription className="text-base">
                            Update role information and permissions.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleEditRole} className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="edit_name" className="text-sm font-medium">Role Name *</Label>
                                <Input
                                    id="edit_name"
                                    value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)}
                                    placeholder="Enter role name"
                                    className="h-10"
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-red-600">{editForm.errors.name}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="edit_description" className="text-sm font-medium">Description</Label>
                                <Input
                                    id="edit_description"
                                    value={editForm.data.description}
                                    onChange={e => editForm.setData('description', e.target.value)}
                                    placeholder="Enter role description"
                                    className="h-10"
                                />
                                {editForm.errors.description && (
                                    <p className="text-sm text-red-600">{editForm.errors.description}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <Label className="text-sm font-medium">Permissions *</Label>
                            <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
                                {Object.entries(availablePermissions).map(([category, permissions]) => {
                                    const IconComponent = getCategoryIcon(category);
                                    return (
                                        <div key={category} className="mb-6 last:mb-0">
                                            <div className="flex items-center gap-2 mb-3">
                                                <IconComponent className="h-4 w-4 text-muted-foreground" />
                                                <h4 className="font-medium text-sm capitalize">{category}</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                                                {Object.entries(permissions).map(([permission, label]) => (
                                                    <div key={permission} className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`edit-${permission}`}
                                                            checked={editForm.data.permissions.includes(permission)}
                                                            onChange={(e) => handlePermissionChange(permission, e.target.checked, editForm)}
                                                            className="h-4 w-4 rounded border-gray-300"
                                                        />
                                                        <Label htmlFor={`edit-${permission}`} className="text-sm cursor-pointer">
                                                            {label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {editForm.errors.permissions && (
                                <p className="text-sm text-red-600">{editForm.errors.permissions}</p>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="edit_is_active"
                                    checked={editForm.data.is_active}
                                    onChange={e => editForm.setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="edit_is_active" className="text-sm font-medium">Active Role</Label>
                            </div>
                            
                            <div className="flex space-x-3">
                                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    {editForm.processing ? 'Updating...' : 'Update Role'}
                                </Button>
                            </div>
                        </div>
                        
                        {/* Display any general form errors */}
                        {Object.keys(editForm.errors).length > 0 && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
                                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                                    {Object.entries(editForm.errors).map(([field, message]) => (
                                        <li key={field}>{message}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl text-red-600">Delete Role</DialogTitle>
                        <DialogDescription className="text-base">
                            Are you sure you want to delete the <span className="font-medium">{selectedRole?.name}</span> role? 
                            This action cannot be undone and will affect all users with this role.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={deleteRole} className="bg-red-600 hover:bg-red-700">
                            Delete Role
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
} 