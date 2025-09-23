<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class AccountManagementController extends Controller
{
    /**
     * Display the account management page.
     */
    public function index(): Response
    {
        $users = User::with('role')
            ->latest()
            ->paginate(10);

        $roles = Role::active()->whereNotIn('slug', ['regular-user', 'community-admin'])->get();

        return Inertia::render('admin/account-management', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created user account.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => 'required|exists:roles,id',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:500',
            'is_active' => 'boolean'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'phone' => $request->phone,
            'bio' => $request->bio,
            'is_active' => $request->is_active ?? true,
            'email_verified_at' => now(), // Auto-verify admin created accounts
        ]);

        return back()->with('success', 'User account created successfully.');
    }

    /**
     * Update the specified user account.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,'.$user->id,
            'role_id' => 'required|exists:roles,id',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:500',
            'is_active' => 'boolean'
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'phone' => $request->phone,
            'bio' => $request->bio,
            'is_active' => $request->is_active ?? true,
        ]);

        return back()->with('success', 'User account updated successfully.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request, User $user)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'User password updated successfully.');
    }

    /**
     * Toggle user active status.
     */
    public function toggleStatus(User $user)
    {
        $user->update([
            'is_active' => !$user->is_active,
        ]);

        $status = $user->is_active ? 'activated' : 'deactivated';
        
        return back()->with('success', "User account {$status} successfully.");
    }

    /**
     * Remove the specified user account.
     */
    public function destroy(User $user)
    {
        // Prevent deletion of the current user
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $user->delete();

        return back()->with('success', 'User account deleted successfully.');
    }
} 