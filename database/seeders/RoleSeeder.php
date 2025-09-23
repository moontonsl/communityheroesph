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

        Role::create([
            'name' => 'Super Administrator',
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
        ]);

        Role::create([
            'name' => 'Community Administrator',
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
        ]);



        Role::create([
            'name' => 'Barangay Representative',
            'slug' => 'barangay-representative',
            'description' => 'Barangay representative with submission management permissions',
            'permissions' => [
                'submissions.create',
                'submissions.read',
                'submissions.update.own',
                'reports.read.own',
                'profile.read',
                'profile.update'
            ],
            'is_active' => true
        ]);

        $this->command->info('Roles created successfully!');
    }
}
