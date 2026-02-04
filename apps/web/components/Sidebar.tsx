"use client";

import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
    LayoutDashboard,
    Building2,
    Warehouse, Settings,
    Construction,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";
import { cn } from "@/lib/utils";


import { UserSession } from "@construction/shared";
import { getServerSession } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const getNavigation = (t: any) => [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("sales"), href: "/sales", icon: Warehouse }, // Using Warehouse as icon for now, will add ShoppingCart
    { name: t("projects"), href: "/projects", icon: Building2 },
    {
        name: t("warehouse"),
        href: "/warehouse",
        icon: Warehouse,
        children: [
            { name: t("material-in"), href: "/warehouse" },
            { name: t("stock-out"), href: "/warehouse/stock-out" },
            { name: t("inventory-list"), href: "/warehouse/inventory" },
        ]
    },
];



interface SidebarProps {
    className?: string;
    hideLogo?: boolean;
    collapsible?: boolean;
    onClick?: () => void;
}

export default function Sidebar({ className, hideLogo = false, collapsible = true, onClick }: SidebarProps) {
    const [user, setUser] = useState<UserSession | null>(null);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const t = useTranslations("common");
    const navigation = getNavigation(t);

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem("sidebar-collapsed");
        if (stored) {
            setIsCollapsed(stored === "true");
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("sidebar-collapsed", String(isCollapsed));
        }
    }, [isCollapsed, isMounted]);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getServerSession();
            setUser(session);
        };
        fetchSession();
    }, []);

    const sidebarCollapsed = !collapsible ? false : isCollapsed;

    return (
        <aside className={cn(
            "border-r border-border flex flex-col bg-sidebar shrink-0 transition-all duration-300 ease-in-out relative",
            sidebarCollapsed ? "w-[76px]" : "w-64",
            className
        )}>
            {collapsible && (
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-10 bg-background border border-border rounded-full size-6 flex items-center justify-center hover:bg-accent transition-all shadow-sm z-50 hidden lg:flex group"
                >
                    {sidebarCollapsed ? (
                        <PanelLeftOpen className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    ) : (
                        <PanelLeftClose className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                </button>
            )}
            {!hideLogo && (
                <div className={cn("p-6", sidebarCollapsed && "px-4")}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-primary rounded-lg size-10 flex items-center justify-center text-primary-foreground shrink-0">
                            <Construction className="size-6" />
                        </div>
                        {!sidebarCollapsed && (
                            <div className="transition-opacity duration-300">
                                <h1 className="text-base font-bold leading-tight truncate">BluePrint ERP</h1>
                                <p className="text-muted-foreground text-xs truncate">
                                    Sistem Manajemen Konstruksi
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <nav className="flex-1 px-3 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                    return (
                        <div key={item.name} className="space-y-1">
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        onClick={onClick}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium overflow-hidden",
                                            isActive
                                                ? "bg-primary/10 text-primary dark:bg-primary/20"
                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                            sidebarCollapsed && "justify-center px-0 w-10 mx-auto"
                                        )}
                                    >
                                        <item.icon className={cn("size-5 shrink-0", isActive && "text-primary")} />
                                        {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                                    </Link>
                                </TooltipTrigger>
                                {sidebarCollapsed && (
                                    <TooltipContent side="right">
                                        {item.name}
                                    </TooltipContent>
                                )}
                            </Tooltip>

                            {!sidebarCollapsed && item.children && (isActive || item.children.some(child => pathname === child.href)) && (
                                <div className="ml-9 space-y-1">
                                    {item.children.map((child) => {
                                        const isChildActive = pathname === child.href;
                                        return (
                                            <Link
                                                onClick={onClick}
                                                key={child.name}
                                                href={child.href}
                                                className={cn(
                                                    "block px-3 py-1.5 text-xs transition-colors",
                                                    isChildActive
                                                        ? "text-primary font-medium"
                                                        : "text-muted-foreground hover:text-primary"
                                                )}
                                            >
                                                {child.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className={cn("p-4 border-t border-border", sidebarCollapsed && "px-2")}>
                <div className={cn("flex items-center gap-3 px-2 overflow-hidden", sidebarCollapsed && "justify-center px-0")}>
                    <div className="size-8 rounded-full bg-muted overflow-hidden relative shrink-0">
                        <Image
                            className="object-cover"
                            alt={user ? `${user.firstName} ${user.lastName}` : "User"}
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfWI5gFm_doLzrPctsrU6dUv8HIjUvp1TYPnb6lYG_f2BcxxdWz_eo2F3oQjLuHjGFu6NeH0mHMAm3mf1RsudX4ChUEeMpcl7nT5cQbzeNPeIuR4_ffXffZSPRmePBo26zKInp477mqvUomUEBuWJxwIfpGojp5FlnAunZG0SrTuTAyvKykAFhuUv1SwGy-HEAi6AT4pZtknQAF4Swjccz_hlNDl2AfX-1K5RCSudC4U74Cq4cHUIr0_smHAN5Ej2wFKdI_W6CaXyp"
                            fill
                            sizes="32px"
                        />
                    </div>
                    {!sidebarCollapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {user ? `${user.firstName} ${user.lastName}` : "..."}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                    Administrator
                                </p>
                            </div>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link href="/account-settings/profile">
                                        <Settings className="size-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                                    </Link>
                                </TooltipTrigger>
                                {sidebarCollapsed && (
                                    <TooltipContent side="right">
                                        Profile Settings
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
