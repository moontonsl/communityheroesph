<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RoleManagementController extends Controller
{
    /**
     * Display the role management page.
     */
    public function index(): Response
    {
        $roles = Role::withCount('users')
            ->latest()
            ->paginate(10);

        // Available permissions list
        $availablePermissions = [
            'users' => [
                'users.create' => 'Create Users',
                'users.read' => 'View Users',
                'users.update' => 'Update Users',
                'users.delete' => 'Delete Users',
            ],
            'roles' => [
                'roles.create' => 'Create Roles',
                'roles.read' => 'View Roles',
                'roles.update' => 'Update Roles',
                'roles.delete' => 'Delete Roles',
            ],
            'submissions' => [
                'submissions.create' => 'Create Submissions',
                'submissions.read' => 'View All Submissions',
                'submissions.read.own' => 'View Own Submissions',
                'submissions.update' => 'Update Submissions',
                'submissions.update.own' => 'Update Own Submissions',
                'submissions.delete' => 'Delete Submissions',
                'submissions.approve' => 'Approve Submissions',
                'submissions.reject' => 'Reject Submissions',
                'submissions.review' => 'Review Submissions',
            ],
            'reports' => [
                'reports.read' => 'View All Reports',
                'reports.read.own' => 'View Own Reports',
                'reports.create' => 'Create Reports',
                'reports.export' => 'Export Reports',
            ],
            'profile' => [
                'profile.read' => 'View Profile',
                'profile.update' => 'Update Profile',
            ],
            'settings' => [
                'settings.read' => 'View Settings',
                'settings.update' => 'Update Settings',
            ],
            'system' => [
                'system.admin' => 'System Administration',
                'system.maintenance' => 'System Maintenance',
            ],
        ];

        return Inertia::render('admin/role-management', [
            'roles' => $roles,
            'availablePermissions' => $availablePermissions
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:500',
            'permissions' => 'required|array|min:1',
            'permissions.*' => 'string',
            'is_active' => 'boolean'
        ]);

        $slug = Str::slug($request->name);
        
        // Ensure slug is unique
        $originalSlug = $slug;
        $counter = 1;
        while (Role::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        Role::create([
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'permissions' => $request->permissions,
            'is_active' => $request->is_active ?? true,
        ]);

        return back()->with('success', 'Role created successfully.');
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, Role $role)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
                'description' => 'nullable|string|max:500',
                'permissions' => 'required|array|min:1',
                'permissions.*' => 'string',
                'is_active' => 'sometimes|boolean'
            ]);

            // Update slug if name changed
            $slug = $role->slug;
            if ($role->name !== $request->name) {
                $slug = Str::slug($request->name);
                
                // Ensure slug is unique
                $originalSlug = $slug;
                $counter = 1;
                while (Role::where('slug', $slug)->where('id', '!=', $role->id)->exists()) {
                    $slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            $role->update([
                'name' => $request->name,
                'slug' => $slug,
                'description' => $request->description,
                'permissions' => $request->permissions,
                'is_active' => $request->has('is_active') ? (bool) $request->is_active : $role->is_active,
            ]);

            return back()->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update role: ' . $e->getMessage()]);
        }
    }

    /**
     * Toggle role active status.
     */
    public function toggleStatus(Role $role)
    {
        $role->update([
            'is_active' => !$role->is_active,
        ]);

        $status = $role->is_active ? 'activated' : 'deactivated';
        
        return back()->with('success', "Role {$status} successfully.");
    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role)
    {
        // Prevent deletion of roles that have users assigned
        if ($role->users()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete role that has users assigned to it.']);
        }

        // Prevent deletion of core system roles
        $protectedRoles = ['super-admin', 'community-admin', 'regular-user'];
        if (in_array($role->slug, $protectedRoles)) {
            return back()->withErrors(['error' => 'Cannot delete system roles.']);
        }

        $role->delete();

        return back()->with('success', 'Role deleted successfully.');
    }
} 