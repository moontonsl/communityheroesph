import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ToastContainer, useToast } from '@/components/ui/toast';
import { Plus, Edit, Trash2, UserCheck, UserX, Key, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    is_active: boolean;
    role?: {
        id: number;
        name: string;
        slug: string;
    };
    created_at: string;
    email_verified_at?: string;
}

interface Role {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    roles: Role[];
}

export default function AccountManagement({ users, roles }: Props) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users.data);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        phone: '',
        bio: '',
        is_active: true,
    });

    const editForm = useForm({
        name: '',
        email: '',
        role_id: '',
        phone: '',
        bio: '',
        is_active: true,
    });

    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    // Filter users based on search query
    useEffect(() => {
        const filtered = users.data.filter(user => 
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.role?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
            (user.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users.data]);

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/account-management', {
            onSuccess: () => {
                setCreateModalOpen(false);
                createForm.reset();
                showSuccess('Account Created', 'User account has been created successfully.');
            },
            onError: () => {
                showError('Creation Failed', 'Failed to create account. Please check the form and try again.');
            },
        });
    };

    const handleEditUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        
        editForm.put(`/admin/account-management/${selectedUser.id}`, {
            onSuccess: () => {
                setEditModalOpen(false);
                setSelectedUser(null);
                editForm.reset();
                showSuccess('Account Updated', 'User account has been updated successfully.');
            },
            onError: () => {
                showError('Update Failed', 'Failed to update account. Please check the form and try again.');
            },
        });
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        
        passwordForm.put(`/admin/account-management/${selectedUser.id}/password`, {
            onSuccess: () => {
                setPasswordModalOpen(false);
                setSelectedUser(null);
                passwordForm.reset();
                showSuccess('Password Updated', 'User password has been updated successfully.');
            },
            onError: () => {
                showError('Password Update Failed', 'Failed to update password. Please try again.');
            },
        });
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role_id: user.role?.id.toString() || '',
            phone: user.phone || '',
            bio: user.bio || '',
            is_active: user.is_active,
        });
        setEditModalOpen(true);
    };

    const openPasswordModal = (user: User) => {
        setSelectedUser(user);
        passwordForm.reset();
        setPasswordModalOpen(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const toggleUserStatus = (user: User) => {
        router.patch(`/admin/account-management/${user.id}/toggle-status`, {}, {
            onSuccess: () => {
                const status = user.is_active ? 'deactivated' : 'activated';
                showSuccess('Status Updated', `User account has been ${status} successfully.`);
            },
            onError: () => {
                showError('Status Update Failed', 'Failed to update user status. Please try again.');
            },
        });
    };

    const deleteUser = () => {
        if (!selectedUser) return;
        router.delete(`/admin/account-management/${selectedUser.id}`, {
            onSuccess: () => {
                showSuccess('Account Deleted', 'User account has been deleted successfully.');
            },
            onError: () => {
                showError('Deletion Failed', 'Failed to delete account. Please try again.');
            },
        });
        setDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const getRoleBadgeVariant = (roleSlug: string) => {
        switch (roleSlug) {
            case 'super-admin':
                return 'destructive';
            case 'community-admin':
                return 'default';
            case 'regular-user':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/account-management', { page }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Account Management" />
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            <div className="space-y-8 p-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Management</h1>
                        <p className="text-muted-foreground">Manage user accounts and permissions across the system</p>
                    </div>
                    
                    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="shadow-sm">
                                <Plus className="mr-2 h-5 w-5" />
                                Create Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader className="space-y-3">
                                <DialogTitle className="text-xl">Create New Account</DialogTitle>
                                <DialogDescription className="text-base">
                                    Create a new user account with the specified role and permissions.
                                </DialogDescription>
                            </DialogHeader>
                            
                            <form onSubmit={handleCreateUser} className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={createForm.data.name}
                                            onChange={e => createForm.setData('name', e.target.value)}
                                            placeholder="Enter full name"
                                            className="h-10"
                                            required
                                        />
                                        {createForm.errors.name && (
                                            <p className="text-sm text-red-600">{createForm.errors.name}</p>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={createForm.data.email}
                                            onChange={e => createForm.setData('email', e.target.value)}
                                            placeholder="Enter email address"
                                            className="h-10"
                                            required
                                        />
                                        {createForm.errors.email && (
                                            <p className="text-sm text-red-600">{createForm.errors.email}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={createForm.data.password}
                                            onChange={e => createForm.setData('password', e.target.value)}
                                            placeholder="Enter password"
                                            className="h-10"
                                            required
                                        />
                                        {createForm.errors.password && (
                                            <p className="text-sm text-red-600">{createForm.errors.password}</p>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium">Confirm Password *</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={createForm.data.password_confirmation}
                                            onChange={e => createForm.setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm password"
                                            className="h-10"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-sm font-medium">Role *</Label>
                                        <Select value={createForm.data.role_id} onValueChange={value => createForm.setData('role_id', value)}>
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map(role => (
                                                    <SelectItem key={role.id} value={role.id.toString()}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {createForm.errors.role_id && (
                                            <p className="text-sm text-red-600">{createForm.errors.role_id}</p>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={createForm.data.phone}
                                            onChange={e => createForm.setData('phone', e.target.value)}
                                            placeholder="Enter phone number"
                                            className="h-10"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                                    <Input
                                        id="bio"
                                        value={createForm.data.bio}
                                        onChange={e => createForm.setData('bio', e.target.value)}
                                        placeholder="Enter user bio"
                                        className="h-10"
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={createForm.data.is_active}
                                            onChange={e => createForm.setData('is_active', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="is_active" className="text-sm font-medium">Active Account</Label>
                                    </div>
                                    
                                    <div className="flex space-x-3">
                                        <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={createForm.processing}>
                                            {createForm.processing ? 'Creating...' : 'Create Account'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                    <p className="text-2xl font-bold">{users.total}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <UserCheck className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                                    <p className="text-2xl font-bold">{users.data.filter(u => u.is_active).length}</p>
                                </div>
                                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <UserCheck className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-red-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Super Admins</p>
                                    <p className="text-2xl font-bold">{users.data.filter(u => u.role?.slug === 'super-admin').length}</p>
                                </div>
                                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <UserX className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Community Admins</p>
                                    <p className="text-2xl font-bold">{users.data.filter(u => u.role?.slug === 'community-admin').length}</p>
                                </div>
                                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <UserCheck className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table Card */}
                <Card className="shadow-sm">
                    <CardHeader className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl">User Accounts</CardTitle>
                                <CardDescription className="text-base">
                                    Manage all user accounts in the system
                                </CardDescription>
                            </div>
                            
                            {/* Search Bar */}
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users by name, email, or role..."
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
                                        <th className="text-left p-4 font-medium">User</th>
                                        <th className="text-left p-4 font-medium">Role</th>
                                        <th className="text-left p-4 font-medium">Status</th>
                                        <th className="text-left p-4 font-medium">Created</th>
                                        <th className="text-right p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user.id} className={`border-b hover:bg-muted/30 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="font-medium text-foreground">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                    {user.phone && (
                                                        <div className="text-sm text-muted-foreground">{user.phone}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={getRoleBadgeVariant(user.role?.slug || 'regular-user')} className="font-medium">
                                                    {user.role?.name || 'No Role'}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={user.is_active ? 'default' : 'secondary'} className="font-medium">
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString('en-US', {
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
                                                        onClick={() => openEditModal(user)}
                                                        className="h-8 w-8 p-0"
                                                        title="Edit user"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => openPasswordModal(user)}
                                                        className="h-8 w-8 p-0"
                                                        title="Change password"
                                                    >
                                                        <Key className="h-4 w-4" />
                                                    </Button>
                                                    
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => toggleUserStatus(user)}
                                                        className="h-8 w-8 p-0"
                                                        title={user.is_active ? 'Deactivate user' : 'Activate user'}
                                                    >
                                                        {user.is_active ? (
                                                            <UserX className="h-4 w-4" />
                                                        ) : (
                                                            <UserCheck className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => openDeleteModal(user)}
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                        title="Delete user"
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
                        
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <div className="space-y-3">
                                    <UserX className="h-12 w-12 text-muted-foreground mx-auto" />
                                    <div>
                                        <p className="text-lg font-medium">No users found</p>
                                        <p className="text-muted-foreground">
                                            {searchQuery ? 'Try adjusting your search criteria' : 'No user accounts exist yet'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
                                <div className="text-sm text-muted-foreground">
                                    Showing {users.from} to {users.to} of {users.total} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(users.current_page - 1)}
                                        disabled={users.current_page === 1}
                                        className="h-8"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>
                                    
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(5, users.last_page) }, (_, i) => {
                                            const page = users.current_page <= 3 
                                                ? i + 1 
                                                : users.current_page + i - 2;
                                            
                                            if (page > users.last_page) return null;
                                            
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={page === users.current_page ? "default" : "outline"}
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
                                        onClick={() => handlePageChange(users.current_page + 1)}
                                        disabled={users.current_page === users.last_page}
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

            {/* Edit User Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl">Edit User Account</DialogTitle>
                        <DialogDescription className="text-base">
                            Update user account information and settings.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleEditUser} className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="edit_name" className="text-sm font-medium">Full Name *</Label>
                                <Input
                                    id="edit_name"
                                    value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)}
                                    placeholder="Enter full name"
                                    className="h-10"
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="edit_email" className="text-sm font-medium">Email Address *</Label>
                                <Input
                                    id="edit_email"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={e => editForm.setData('email', e.target.value)}
                                    placeholder="Enter email address"
                                    className="h-10"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="edit_role" className="text-sm font-medium">Role *</Label>
                                <Select value={editForm.data.role_id} onValueChange={value => editForm.setData('role_id', value)}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map(role => (
                                            <SelectItem key={role.id} value={role.id.toString()}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="edit_phone" className="text-sm font-medium">Phone Number</Label>
                                <Input
                                    id="edit_phone"
                                    value={editForm.data.phone}
                                    onChange={e => editForm.setData('phone', e.target.value)}
                                    placeholder="Enter phone number"
                                    className="h-10"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="edit_bio" className="text-sm font-medium">Bio</Label>
                            <Input
                                id="edit_bio"
                                value={editForm.data.bio}
                                onChange={e => editForm.setData('bio', e.target.value)}
                                placeholder="Enter user bio"
                                className="h-10"
                            />
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
                                <Label htmlFor="edit_is_active" className="text-sm font-medium">Active Account</Label>
                            </div>
                            
                            <div className="flex space-x-3">
                                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    {editForm.processing ? 'Updating...' : 'Update Account'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Password Update Modal */}
            <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl">Update Password</DialogTitle>
                        <DialogDescription className="text-base">
                            Change the password for <span className="font-medium">{selectedUser?.name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleUpdatePassword} className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <Label htmlFor="new_password" className="text-sm font-medium">New Password *</Label>
                            <Input
                                id="new_password"
                                type="password"
                                value={passwordForm.data.password}
                                onChange={e => passwordForm.setData('password', e.target.value)}
                                placeholder="Enter new password"
                                className="h-10"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password" className="text-sm font-medium">Confirm Password *</Label>
                            <Input
                                id="confirm_password"
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                placeholder="Confirm new password"
                                className="h-10"
                                required
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setPasswordModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={passwordForm.processing}>
                                {passwordForm.processing ? 'Updating...' : 'Update Password'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl text-red-600">Delete User Account</DialogTitle>
                        <DialogDescription className="text-base">
                            Are you sure you want to delete <span className="font-medium">{selectedUser?.name}</span>'s account? 
                            This action cannot be undone and will permanently remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={deleteUser} className="bg-red-600 hover:bg-red-700">
                            Delete Account
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
} 