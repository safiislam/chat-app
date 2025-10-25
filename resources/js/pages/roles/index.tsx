import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, PenTool, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

type Permission = {
    id: number;
    name: string;
};

type Role = {
    id: number;
    name: string;
    permissions: Permission[];
};

type PageProps = {
    roles: Role[];
};

export default function RolesIndex() {
    const { props } = usePage<PageProps>();
    const { roles } = props;

    const handleDelete = (roleId: number) => {
        if (
            confirm(
                'Are you sure you want to delete this role? This action cannot be undone.',
            )
        ) {
            router.delete(`/roles/${roleId}`, {
                preserveScroll: true,
            });
        }
    };

    const formatPermissions = (permissions: Permission[]) => {
        if (!permissions || permissions.length === 0) return '—';

        if (permissions.length <= 3) {
            return permissions.map((p) => p.name.replace(/_/g, ' ')).join(', ');
        }

        const first = permissions
            .slice(0, 2)
            .map((p) => p.name.replace(/_/g, ' '))
            .join(', ');
        return `${first} +${permissions.length - 2} more`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-lg bg-gray-50 p-4 dark:bg-black">
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    {/* Table Header with Create Button */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-5 sm:px-6 dark:border-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Roles
                        </h3>
                        <Link
                            href="/roles/create"
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700"
                        >
                            Create Role
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                    >
                                        #
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                    >
                                        Permissions
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-black">
                                {roles.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                                    <AlertTriangle className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    No roles found
                                                </p>
                                                <Link
                                                    href="/roles/create"
                                                    className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                                >
                                                    Create your first role
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    roles.map((role, index) => (
                                        <tr
                                            key={role.id}
                                            className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/80"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                <div className="flex items-center">
                                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                                        <span className="text-xs font-semibold text-white uppercase">
                                                            {role.name.charAt(
                                                                0,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <span className="font-medium capitalize">
                                                        {role.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="max-w-xs">
                                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                        {role.permissions
                                                            ?.length || 0}{' '}
                                                        permissions
                                                    </span>
                                                    {role.permissions &&
                                                        role.permissions
                                                            .length > 0 && (
                                                            <p
                                                                className="mt-1 truncate text-xs text-gray-400"
                                                                title={role.permissions
                                                                    .map(
                                                                        (p) =>
                                                                            p.name,
                                                                    )
                                                                    .join(', ')}
                                                            >
                                                                {formatPermissions(
                                                                    role.permissions,
                                                                )}
                                                            </p>
                                                        )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/roles/${role.id}/edit`}
                                                        className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-300"
                                                    >
                                                        <PenTool className="h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                role.id,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
