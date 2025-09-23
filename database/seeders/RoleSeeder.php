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
            ['name' => 'Super Administrator'],
            [
                'slug' => 'super-admin',
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
            ['name' => 'Community Administrator'],
            [
                'slug' => 'community-admin',
                'description' => 'Community management with submission approval permissions',
                'permissions' => [
                    'submissions.read',
                    'submissions.update',
                    'submissions.approve',
                    'submissions.reject',
                    'submissions.review',
                    'reports.read',
                    'users.read'
                ],
                'is_active' => true
            ]
        );



        Role::create([
            'name' => 'Area Admin',
            'slug' => 'area-admin',
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
        ]);

        Role::create([
            'name' => 'Community Lead',
            'slug' => 'community-lead',
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
        ]);

        Role::create([
            'name' => 'Super Admin A',
            'slug' => 'super-admin-a',
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
        ]);

        Role::create([
            'name' => 'Super Admin B',
            'slug' => 'super-admin-b',
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
        ]);

        $this->command->info('Roles created successfully!');
    }
}
