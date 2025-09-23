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
                'description' => 'Area administrator with regional management permissions',
                'permissions' => [
                    'submissions.create',
                    'submissions.read',
                    'submissions.update',
                    'submissions.approve',
                    'submissions.reject',
                    'users.read',
                    'reports.read',
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
                'description' => 'Community leader with local management permissions',
                'permissions' => [
                    'submissions.create',
                    'submissions.read',
                    'submissions.update.own',
                    'reports.read.own',
                    'users.read',
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
                'description' => 'Super Administrator A with full system access',
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
                    'reports.export',
                    'settings.read',
                    'settings.update',
                    'system.admin'
                ],
                'is_active' => true
            ]
        );

        Role::updateOrCreate(
            ['slug' => 'super-admin-b'],
            [
                'name' => 'Super Admin B',
                'description' => 'Super Administrator B with full system access',
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
                    'reports.export',
                    'settings.read',
                    'settings.update',
                    'system.admin'
                ],
                'is_active' => true
            ]
        );

        $this->command->info('Roles created successfully!');
    }
}
