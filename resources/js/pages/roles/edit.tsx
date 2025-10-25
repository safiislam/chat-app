import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Edit Role',
        href: `/roles/edit`,
    },
];

type Permissions = Record<string, Record<string, string[]>>;

type Permission = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot?: {
        role_id: number;
        permission_id: number;
    };
};

type Role = {
    id: number;
    name: string;
    permissions: Permission[];
};

type PageProps = {
    role: Role;
    permissions: Permissions;
    allPermissions: Permission[];
};

export default function EditRole({ role, permissions, allPermissions }: PageProps) {
    const { data, setData, put, errors, processing } = useForm({
        name: role.name,
        permissions: role.permissions.map((p) => p.id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
    };

    const isPermissionSelected = (permissionName: string) => {
        const permission = allPermissions.find((p) => p.name === permissionName);
        return permission ? data.permissions.includes(permission.id) : false;
    };

    const togglePermission = (permissionName: string) => {
        const permission = allPermissions.find((p) => p.name === permissionName);
        if (!permission) return;
        setData('permissions',
            data.permissions.includes(permission.id)
                ? data.permissions.filter((id) => id !== permission.id)
                : [...data.permissions, permission.id]
        );
    };

    const handleModuleToggle = (perms: string[]) => {
        const permissionIds = perms.map(permissionName => {
            const permission = allPermissions.find(p => p.name === permissionName);
            return permission?.id;
        }).filter(Boolean) as number[];

        const allSelected = permissionIds.every(id => data.permissions.includes(id));

        setData('permissions',
            allSelected
                ? data.permissions.filter(id => !permissionIds.includes(id))
                : [...new Set([...data.permissions, ...permissionIds])]
        );
    };
    const handleAllPermissionsToggle = () => {
        const allPermissionIds = allPermissions.map(permission => permission.id);
        const allSelected = allPermissionIds.every(id => data.permissions.includes(id));

        setData('permissions',
            allSelected
                ? data.permissions.filter(id => !allPermissionIds.includes(id))
                : [...new Set([...data.permissions, ...allPermissionIds])]
        );

    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Role" />
            <div className="flex flex-col flex-1 gap-6 bg-gray-50 dark:bg-black p-4 rounded-lg h-full">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Role Name Field */}
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-md">
                            <label className="block mb-2 font-medium text-gray-700 text-sm dark:text-gray-200" htmlFor="role-name">
                                Role Name
                            </label>
                            <input
                                onChange={(e) => setData('name', e.target.value)}
                                value={data.name}
                                className="bg-white dark:bg-gray-900 shadow-sm px-4 py-2 border border-gray-300 focus:border-indigo-500 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 transition-colors focus:ring-2 focus:ring-indigo-500"
                                id="role-name"
                                type="text"
                                placeholder="e.g. Admin"
                            />
                            {errors.name && (
                                <p className="mt-2 text-red-600 text-sm dark:text-red-400">{errors.name}</p>
                            )}
                        </div>
                        <div className='space-x-3 mt-7'>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 shadow-sm px-4 py-[11px] rounded-md font-medium text-sm text-white transition-colors disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {processing ? 'Updating...' : 'Update Role'}
                            </button>
                            <Link
                                href="/roles"
                                className="inline-flex items-center bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 shadow-sm px-4 py-[11px] border border-gray-300 dark:border-gray-700 rounded-md font-medium text-gray-700 text-sm dark:text-gray-200 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>

                    </div>

                    {/* Permissions Section */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <label className="block font-medium text-gray-900 text-lg dark:text-gray-100">
                                Permissions
                            </label>
                            <div className='flex items-center gap-3'>
                                <input
                                    type="checkbox"
                                    checked={allPermissions.every(permission => data.permissions.includes(permission.id))}
                                    onChange={() => handleAllPermissionsToggle()}
                                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded w-4 h-4 text-indigo-600 dark:text-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                />
                                <h4 className="font-semibold text-green-600 text-sm dark:text-green-400">
                                    All Permissions
                                </h4>
                            </div>
                        </div>

                        {Object.entries(permissions).map(([category, modules]) => (
                            <div key={category} className="shadow-sm border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                                {/* Category Header */}
                                <h3 className="bg-gray-100 dark:bg-gray-900 px-4 py-3 border-gray-200 dark:border-gray-800 border-b font-semibold text-gray-900 text-xl dark:text-gray-200 capitalize">
                                    {category}
                                </h3>

                                {Object.entries(modules).map(([module, perms]) => (
                                    <div key={module} className="bg-white dark:bg-black border-gray-600">
                                        {/* Module Checkbox */}
                                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/80 px-4 py-3 border-gray-100 dark:border-gray-800 border-b transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={perms.every(permissionName => {
                                                    const permission = allPermissions.find(p => p.name === permissionName);
                                                    return permission ? data.permissions.includes(permission.id) : false;
                                                })}
                                                onChange={() => handleModuleToggle(perms)}
                                                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded w-4 h-4 text-indigo-600 dark:text-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                            />
                                            <h4 className="font-semibold text-green-600 text-lg dark:text-green-400 capitalize">
                                                {module}
                                            </h4>
                                        </div>

                                        {/* Permissions Grid */}
                                        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4">
                                            {perms.map((permission) => (
                                                <div key={permission} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={permission}
                                                        checked={isPermissionSelected(permission)}
                                                        onChange={() => togglePermission(permission)}
                                                        className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded w-4 h-4 text-indigo-600 dark:text-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                                    />
                                                    <label
                                                        htmlFor={permission}
                                                        className="bg-blue-100/50 hover:bg-blue-200/50 dark:bg-gray-800 dark:hover:bg-gray-700 ml-3 px-3 py-1 rounded font-medium text-gray-700 text-sm dark:text-gray-300 transition-colors"
                                                    >
                                                        {permission}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-gray-200 dark:border-gray-800 border-t">
                        <Link
                            href="/roles"
                            className="inline-flex items-center bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 shadow-sm px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md font-medium text-gray-700 text-sm dark:text-gray-200 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 shadow-sm px-4 py-[11px] rounded-md font-medium text-sm text-white transition-colors disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {processing ? 'Updating...' : 'Update Role'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}