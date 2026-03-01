import { Link } from '@inertiajs/react';
import { BarChart3, BookOpen, FolderGit2, LayoutDashboard, LayoutGrid, Package, ShoppingCart } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'ပင်မစာမျက်နှာ',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'ပစ္စည်းများ',
        href: "/products",
        icon: Package,
    },
    {
        title: 'အဝယ်စရင်း',
        href: "/purchases",
        icon: ShoppingCart,
    },
    {
        title: 'အရောင်းစရင်း',
        href: "/sales",
        icon: BarChart3,
    },
    {
        title: 'အစီရင်ခံစာများ',
        href: "/reports",
        icon: LayoutGrid,
    },


];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
