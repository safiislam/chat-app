import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Create Role',
        href: '/roles/create',
    },
];

type Permissions = Record<string, Record<string, string[]>>;

type Permission = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
};

type PageProps = {
    permissions: Permissions;
    allPermissions: Permission[];
};

export default function CreateRole({ permissions, allPermissions }: PageProps) {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        permissions: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/roles');
    };

    const isPermissionSelected = (permissionName: string) => {
        const permission = allPermissions.find(
            (p) => p.name === permissionName,
        );
        return permission ? data.permissions.includes(permission.id) : false;
    };

    const togglePermission = (permissionName: string) => {
        const permission = allPermissions.find(
            (p) => p.name === permissionName,
        );
        if (!permission) return;

        setData(
            'permissions',
            data.permissions.includes(permission.id)
                ? data.permissions.filter((id) => id !== permission.id)
                : [...data.permissions, permission.id],
        );
    };

    const handleModuleToggle = (perms: string[]) => {
        const permissionIds = perms
            .map((permissionName) => {
                const permission = allPermissions.find(
                    (p) => p.name === permissionName,
                );
                return permission?.id;
            })
            .filter(Boolean) as number[];

        const allSelected = permissionIds.every((id) =>
            data.permissions.includes(id),
        );

        setData(
            'permissions',
            allSelected
                ? data.permissions.filter((id) => !permissionIds.includes(id))
                : [...new Set([...data.permissions, ...permissionIds])],
        );
    };

    const handleAllPermissionsToggle = () => {
        const allPermissionIds = allPermissions.map(
            (permission) => permission.id,
        );
        const allSelected = allPermissionIds.every((id) =>
            data.permissions.includes(id),
        );

        setData('permissions', allSelected ? [] : allPermissionIds);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-lg bg-gray-50 p-4 dark:bg-black">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Role Name Field */}
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-md">
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                                htmlFor="role-name"
                            >
                                Role Name
                            </label>
                            <input
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                id="role-name"
                                type="text"
                                placeholder="e.g. Admin"
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="mt-7 space-x-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex cursor-pointer items-center rounded-md bg-indigo-600 px-4 py-[11px] text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Role'}
                            </button>
                            <Link
                                href="/roles"
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <label className="block text-lg font-medium text-gray-900 dark:text-gray-100">
                                Permissions
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={allPermissions.every(
                                        (permission) =>
                                            data.permissions.includes(
                                                permission.id,
                                            ),
                                    )}
                                    onChange={() =>
                                        handleAllPermissionsToggle()
                                    }
                                    className="h-4 w-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-indigo-500 dark:focus:ring-indigo-400"
                                />
                                <h4 className="text-sm font-semibold text-green-600 dark:text-green-400">
                                    All Permissions
                                </h4>
                            </div>
                        </div>

                        {Object.entries(permissions).map(
                            ([category, modules]) => (
                                <div
                                    key={category}
                                    className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-800"
                                >
                                    {/* Category Header */}
                                    <h3 className="border-b border-gray-200 bg-gray-100 px-4 py-3 text-xl font-semibold text-gray-900 capitalize dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
                                        {category}
                                    </h3>

                                    {Object.entries(modules).map(
                                        ([module, perms]) => (
                                            <div
                                                key={module}
                                                className="bg-white dark:bg-black"
                                            >
                                                {/* Module Row */}
                                                <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-100 px-4 py-3 transition-colors dark:border-gray-800 dark:bg-gray-900/80">
                                                    <input
                                                        type="checkbox"
                                                        checked={perms.every(
                                                            (
                                                                permissionName,
                                                            ) => {
                                                                const permission =
                                                                    allPermissions.find(
                                                                        (p) =>
                                                                            p.name ===
                                                                            permissionName,
                                                                    );
                                                                return permission
                                                                    ? data.permissions.includes(
                                                                          permission.id,
                                                                      )
                                                                    : false;
                                                            },
                                                        )}
                                                        onChange={() =>
                                                            handleModuleToggle(
                                                                perms,
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-indigo-500 dark:focus:ring-indigo-400"
                                                    />
                                                    <h4 className="text-lg font-semibold text-green-600 capitalize dark:text-green-400">
                                                        {module}
                                                    </h4>
                                                </div>

                                                {/* Permissions Grid */}
                                                <div className="flex flex-wrap gap-4 p-4">
                                                    {perms.map((permission) => (
                                                        <div
                                                            key={permission}
                                                            className="flex items-center"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id={permission}
                                                                checked={isPermissionSelected(
                                                                    permission,
                                                                )}
                                                                onChange={() =>
                                                                    togglePermission(
                                                                        permission,
                                                                    )
                                                                }
                                                                className="h-4 w-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-indigo-500 dark:focus:ring-indigo-400"
                                                            />
                                                            <label
                                                                htmlFor={
                                                                    permission
                                                                }
                                                                className="ml-3 cursor-pointer rounded bg-blue-100/50 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-200/50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                            >
                                                                {permission}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ),
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
                        <Link
                            href="/roles"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Link>
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex cursor-pointer items-center rounded-md bg-indigo-600 px-4 py-[11px] text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Role'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
