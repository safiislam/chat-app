<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

final class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Resetting cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = config('permissions');

        foreach ($permissions as $modules) {
            foreach ($modules as $modulePermissions) {
                foreach ($modulePermissions as $permission) {
                    Permission::query()->firstOrCreate(['name' => $permission]);
                }
            }
        }

        /**************************************
         * Creating Roles
         **************************************/
        $engineer_role = Role::create(['name' => 'engineer']);
        $admin_role = Role::create(['name' => 'admin']);
        $manager_role = Role::create(['name' => 'manager']);
        $user_role = Role::create(['name' => 'user']);

        // Assign all permissions to admin
        $admin_role->givePermissionTo(Permission::all());

        // Assign user management permissions to manager
        $manager_role->givePermissionTo([
            'access_users',
            'create_users',
            'update_users',
        ]);
        $admin_role->givePermissionTo(Permission::all());

        // Creating an user
        $user = \App\Models\User::factory()->withoutTwoFactor()->create([
            'name' => 'App User',
            'email' => 'user@app.test',
        ]);
        $user->assignRole($user_role);

        // creating an admin user
        $admin = \App\Models\User::factory()->withoutTwoFactor()->create([
            'name' => 'Administrator',
            'email' => 'admin@app.test',

        ]);
        $admin->assignRole($admin_role);

        // Creating an Engineer user
        $engineer = \App\Models\User::factory()->withoutTwoFactor()->create([
            'name' => 'Engineer',
            'email' => 'engineer@app.test',

        ]);
        $engineer->assignRole($engineer_role);

        // Creating a Manager user
        $manager = \App\Models\User::factory()->withoutTwoFactor()->create([
            'name' => 'Manager',
            'email' => 'manager@app.test',
        ]);
        $manager->assignRole($manager_role);
    }
}
