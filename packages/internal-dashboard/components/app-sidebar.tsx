"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Boxes, Command, LayoutGrid, PackageSearch, LucideProps } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { usePathname } from "next/navigation";

type SectionButton = { title: string; url: string; icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> };
const items: SectionButton[] = [
    {
        title: "Overview",
        url: "/",
        icon: LayoutGrid,
    },
    {
        title: "Inventory",
        url: "/inventory",
        icon: PackageSearch,
    },
    {
        title: "Orders",
        url: "/orders",
        icon: Boxes,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar variant="inset" className="border-none">
            <SidebarHeader className="p-3">
                <Link
                    href="/"
                    className="group flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 p-3 text-sidebar-foreground transition hover:border-white/20 hover:bg-white/10"
                >
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-sidebar-primary shadow-inner shadow-white/10">
                        <Command className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sidebar-foreground/60">TBS</p>
                        <p className="truncate text-sm font-semibold text-sidebar-foreground">Internal Dashboard</p>
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent className="px-3">
                <SidebarGroup className="rounded-[24px] border border-white/10 bg-white/[0.04] p-3">
                    <SidebarGroupLabel className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sidebar-foreground/60">
                        Workspace
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {items.map((item) => {
                                const isActive = item.url === "/" ? pathname === item.url : pathname === item.url || pathname.startsWith(`${item.url}/`);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={cn(
                                                "h-11 rounded-2xl px-3 text-sidebar-foreground/80 transition hover:bg-white/10 hover:text-sidebar-foreground",
                                                isActive && "bg-white text-slate-900 shadow-lg shadow-black/10 hover:bg-white",
                                            )}
                                        >
                                            <Link href={item.url}>
                                                <item.icon className={cn("size-4", isActive ? "text-primary" : "text-sidebar-foreground/60")} />
                                                <span className="font-medium">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-3">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-sidebar-foreground/70">
                    <p className="font-semibold text-sidebar-foreground">Operations workspace</p>
                    <p className="mt-1 leading-6">Use the dashboard to keep catalog changes, stock levels, and order fulfillment aligned.</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                        <span>Sidebar shortcut</span>
                        <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 font-medium text-sidebar-foreground">Cmd/Ctrl + B</span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
