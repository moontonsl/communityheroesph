<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating admin users...');

        // Get roles
        $superAdminRole = Role::where('slug', 'super-admin')->first();
        $communityAdminRole = Role::where('slug', 'community-admin')->first();

        if (!$superAdminRole || !$communityAdminRole) {
            $this->command->error('Roles not found. Please run RoleSeeder first.');
            return;
        }

        // Create Super Admin
        $superAdmin = User::updateOrCreate(
            ['email' => 'superadmin@communityheroes.ph'],
            [
                'name' => 'Super Administrator',
                'email' => 'superadmin@communityheroes.ph',
                'password' => Hash::make('SuperAdmin@2025!'),
                'role_id' => $superAdminRole->id,
                'is_active' => true,
                'phone' => '+63 917 123 4567',
                'bio' => 'System Super Administrator with full access to all features and settings.',
                'email_verified_at' => now()
            ]
        );

        // Create Community Admin
        $communityAdmin = User::updateOrCreate(
            ['email' => 'communityadmin@communityheroes.ph'],
            [
                'name' => 'Community Administrator',
                'email' => 'communityadmin@communityheroes.ph',
                'password' => Hash::make('CommunityAdmin@2025!'),
                'role_id' => $communityAdminRole->id,
                'is_active' => true,
                'phone' => '+63 917 765 4321',
                'bio' => 'Community Administrator responsible for managing barangay submissions and approvals.',
                'email_verified_at' => now()
            ]
        );

        // Create additional Community Admin
        $communityAdmin2 = User::updateOrCreate(
            ['email' => 'admin@communityheroes.ph'],
            [
                'name' => 'Community Admin 2',
                'email' => 'admin@communityheroes.ph',
                'password' => Hash::make('Admin@2025!'),
                'role_id' => $communityAdminRole->id,
                'is_active' => true,
                'phone' => '+63 917 999 8888',
                'bio' => 'Secondary Community Administrator for backup and support.',
                'email_verified_at' => now()
            ]
        );

        $this->command->info('Admin users created successfully!');
        $this->command->info('Super Admin: superadmin@communityheroes.ph / SuperAdmin@2025!');
        $this->command->info('Community Admin: communityadmin@communityheroes.ph / CommunityAdmin@2025!');
        $this->command->info('Community Admin 2: admin@communityheroes.ph / Admin@2025!');
    }
}
