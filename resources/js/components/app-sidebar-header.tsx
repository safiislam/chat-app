import { Breadcrumbs } from '@/components/breadcrumbs';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divide';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggler } from '@/components/ui/theme-toggler';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Input } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { Activity, Info, Plus, Search, Settings } from 'lucide-react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center gap-2">
                <div className="flex flex-1 items-center">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div className="flex items-center">
                    <div className="mr-4 hidden items-center gap-4 lg:flex">
                        <div className="mr-4 flex items-center gap-3">
                            <div className="flex items-center gap-2 rounded-3xl border border-zinc-200 bg-gray-50 px-5 py-1.5 dark:border-zinc-600 dark:bg-zinc-800">
                                <Search className="size-5 text-zinc-400"></Search>
                                <Input
                                    type="text"
                                    className={
                                        'text-zinc-500 placeholder:text-sm focus:outline-0 dark:placeholder:text-zinc-400'
                                    }
                                    placeholder="search for anything here..."
                                ></Input>
                            </div>
                            <Button className="h-8 w-8 rounded-full bg-blue-600">
                                <Plus className="size-6"></Plus>
                            </Button>
                        </div>
                        <Link href={''}>
                            <Info className="text-zinc-400"></Info>
                        </Link>
                        <Link href={''}>
                            <Activity className="text-zinc-400"></Activity>
                        </Link>
                        <Link href={'/settings'}>
                            <Settings className="text-zinc-400"></Settings>
                        </Link>
                    </div>
                    <Divider className="mx-4"></Divider>
                    <ThemeToggler />
                    <Divider className="mx-4"></Divider>
                    <NavUser />
                </div>
            </div>
        </header>
    );
}
