"use client";

import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
    LayoutDashboard,
    Building2,
    Warehouse,
    ShoppingCart,
    BarChart3,
    Settings,
    Construction
} from "lucide-react";
import { cn } from "@/lib/utils";


import { UserSession } from "@construction/shared";
import { getServerSession } from "@/lib/auth";
import { useEffect, useState } from "react";

const getNavigation = (t: any) => [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("projects"), href: "/projects", icon: Building2 },
    {
        name: t("warehouse"),
        href: "/warehouse",
        icon: Warehouse,
        children: [
            { name: "Material In", href: "/warehouse" },
            { name: "Stock Out", href: "/warehouse/stock-out" },
            { name: "Inventory List", href: "/warehouse/inventory" },
        ]
    },
    { name: "Procurement", href: "/procurement", icon: ShoppingCart },
    { name: "Reports", href: "/reports", icon: BarChart3 },
];



export default function Sidebar() {
    const [user, setUser] = useState<UserSession | null>(null);
    const pathname = usePathname();
    const t = useTranslations("common");
    const navigation = getNavigation(t);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getServerSession();
            setUser(session);
        };
        fetchSession();
    }, []);

    return (
        <aside className="w-64 border-r border-border flex flex-col bg-sidebar shrink-0">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary rounded-lg size-10 flex items-center justify-center text-primary-foreground">
                        <Construction className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold leading-tight">BluePrint ERP</h1>
                        <p className="text-muted-foreground text-xs">
                            Sistem Manajemen Konstruksi
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                    return (
                        <div key={item.name} className="space-y-1">
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                                    isActive
                                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className={cn("size-4", isActive && "text-primary")} />
                                <span>{item.name}</span>
                            </Link>

                            {item.children && (isActive || item.children.some(child => pathname === child.href)) && (
                                <div className="ml-9 space-y-1">
                                    {item.children.map((child) => {
                                        const isChildActive = pathname === child.href;
                                        return (
                                            <Link
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

            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-2">
                    <div className="size-8 rounded-full bg-muted overflow-hidden relative">
                        <Image
                            className="object-cover"
                            alt={user ? `${user.firstName} ${user.lastName}` : "User"}
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfWI5gFm_doLzrPctsrU6dUv8HIjUvp1TYPnb6lYG_f2BcxxdWz_eo2F3oQjLuHjGFu6NeH0mHMAm3mf1RsudX4ChUEeMpcl7nT5cQbzeNPeIuR4_ffXffZSPRmePBo26zKInp477mqvUomUEBuWJxwIfpGojp5FlnAunZG0SrTuTAyvKykAFhuUv1SwGy-HEAi6AT4pZtknQAF4Swjccz_hlNDl2AfX-1K5RCSudC4U74Cq4cHUIr0_smHAN5Ej2wFKdI_W6CaXyp"
                            fill
                            sizes="32px"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                            {user ? `${user.firstName} ${user.lastName}` : "..."}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Administrator
                        </p>
                    </div>
                    <Link href="/account-settings/profile">
                        <Settings className="size-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
