<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating roles...');

        Role::updateOrCreate(
            ['slug' => 'super-admin'],
            [
                'name' => 'Super Administrator',
                'description' => 'Full system access with all permissions',
                'permissions' => [
                    'users.create',
                    'users.read',
                    'users.update',
                    'users.delete',
                    'roles.create',
                    'roles.read',
                    'roles.update',
                    'roles.delete',
                    'submissions.create',
                    'submissions.read',
                    'submissions.update',
                    'submissions.delete',
                    'submissions.approve',
                    'submissions.reject',
                    'submissions.review',
                    'reports.read',
                    'settings.read',
                    'settings.update',
                    'system.admin'
                ],
                'is_active' => true
            ]
        );



        Role::updateOrCreate(
            ['slug' => 'area-admin'],
            [
                'name' => 'Area Admin',
                'description' => 'Can apply for barangays and events',
                'permissions' => [
                    'barangays.apply',
                    'events.apply',
                    'submissions.read.own',
                    'profile.read',
                    'profile.update'
                ],
                'is_active' => true
            ]
        );

        Role::updateOrCreate(
            ['slug' => 'community-lead'],
            [
                'name' => 'Community Lead',
                'description' => 'Can apply for barangays and events, pre-approve Area Admin applications',
                'permissions' => [
                    'barangays.apply',
                    'events.apply',
                    'submissions.pre_approve',
                    'submissions.read',
                    'submissions.approve',
                    'profile.read',
                    'profile.update'
                ],
                'is_active' => true
            ]
        );

        Role::updateOrCreate(
            ['slug' => 'super-admin-a'],
            [
                'name' => 'Super Admin A',
                'description' => 'Can apply for barangays and events, final approval of MOA and Event Applications (must be pre-approved by Community Lead)',
                'permissions' => [
                    'barangays.apply',
                    'events.apply',
                    'submissions.final_approve',
                    'submissions.read',
                    'submissions.approve',
                    'submissions.reject',
                    'settings.read',
                    'settings.update',
                    'profile.read',
                    'profile.update'
                ],
                'is_active' => true
            ]
        );

        Role::updateOrCreate(
            ['slug' => 'super-admin-b'],
            [
                'name' => 'Super Admin B',
                'description' => 'Can see/access all applications',
                'permissions' => [
                    'submissions.read.all',
                    'events.read.all',
                    'barangays.read.all',
                    'reports.read',
                    'reports.export',
                    'settings.read',
                    'settings.update',
                    'profile.read',
                    'profile.update'
                ],
                'is_active' => true
            ]
        );

        $this->command->info('Roles created successfully!');
    }
}
