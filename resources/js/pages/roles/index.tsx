import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PenTool, Trash2, AlertTriangle } from 'lucide-react';

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
        if (confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
            router.delete(`/roles/${roleId}`, {
                preserveScroll: true,
            });
        }
    };

    const formatPermissions = (permissions: Permission[]) => {
        if (!permissions || permissions.length === 0) return '—';
        
        if (permissions.length <= 3) {
            return permissions.map(p => p.name.replace(/_/g, ' ')).join(', ');
        }
        
        const first = permissions.slice(0, 2).map(p => p.name.replace(/_/g, ' ')).join(', ');
        return `${first} +${permissions.length - 2} more`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex flex-col flex-1 gap-6 bg-gray-50 dark:bg-black p-4 rounded-lg h-full">
                <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                    {/* Table Header with Create Button */}
                    <div className="flex justify-between items-center px-4 sm:px-6 py-5 border-gray-200 dark:border-gray-800 border-b">
                        <h3 className="font-semibold text-gray-900 text-lg dark:text-gray-100">Roles</h3>
                        <Link
                            href="/roles/create"
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 shadow-sm px-4 py-2 rounded-md font-medium text-sm text-white transition-colors duration-200"
                        >
                            Create Role
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="divide-y divide-gray-200 dark:divide-gray-800 min-w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-medium text-gray-500 text-left text-xs dark:text-gray-400 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-medium text-gray-500 text-left text-xs dark:text-gray-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-medium text-gray-500 text-left text-xs dark:text-gray-400 uppercase tracking-wider">
                                        Permissions
                                    </th>
                                    <th scope="col" className="text-right px-6 py-3 font-medium text-gray-500 text-xs dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                                {roles.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 mb-4 rounded-full w-12 h-12">
                                                    <AlertTriangle className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-sm dark:text-gray-400">No roles found</p>
                                                <Link
                                                    href="/roles/create"
                                                    className="mt-2 font-medium text-indigo-600 text-sm hover:text-indigo-500 dark:text-indigo-400"
                                                >
                                                    Create your first role
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    roles.map((role, index) => (
                                        <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/80 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 text-sm dark:text-gray-100 whitespace-nowrap">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 text-sm dark:text-gray-100 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 mr-3 rounded-lg w-8 h-8">
                                                        <span className="font-semibold text-white text-xs uppercase">
                                                            {role.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <span className="font-medium capitalize">{role.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm dark:text-gray-400">
                                                <div className="max-w-xs">
                                                    <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900 px-2.5 py-0.5 rounded-full font-medium text-blue-800 text-xs dark:text-blue-300">
                                                        {role.permissions?.length || 0} permissions
                                                    </span>
                                                    {role.permissions && role.permissions.length > 0 && (
                                                        <p className="mt-1 text-gray-400 text-xs truncate" title={role.permissions.map(p => p.name).join(', ')}>
                                                            {formatPermissions(role.permissions)}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-right px-6 py-4 font-medium text-sm whitespace-nowrap">
                                                <div className="flex justify-end items-center space-x-2">
                                                    <Link
                                                        href={`/roles/${role.id}/edit`}
                                                        className="inline-flex items-center gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-md font-medium text-indigo-600 text-sm hover:text-indigo-500 dark:hover:text-indigo-300 dark:text-indigo-400 transition-colors"
                                                    >
                                                        <PenTool className="w-4 h-4" />
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(role.id)}
                                                        className="inline-flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md font-medium text-red-600 text-sm hover:text-red-500 dark:hover:text-red-300 dark:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
