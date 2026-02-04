"use client";

import { ChevronRight, Search, Bell, Home, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

import { usePathname } from "@/i18n/routing";
import { useState } from "react";
import { useBreadcrumbContext } from "./BreadcrumbProvider";

export type Breadcrumb = {
    label: string;
    href?: string;
};

interface HeaderProps {
    breadcrumbs?: Breadcrumb[];
}

export default function Header({ breadcrumbs: manualBreadcrumbs }: HeaderProps) {
    const t = useTranslations("common");
    const pathname = usePathname();

    const { overrides } = useBreadcrumbContext();

    // Generate breadcrumbs from pathname if not provided manually
    const breadcrumbs = manualBreadcrumbs || pathname
        .split("/")
        .filter(Boolean)
        .map((segment, index, array) => {
            const href = "/" + array.slice(0, index + 1).join("/");
            // Use override if available (keyed by path), otherwise capitalize and format segment for label
            const label = overrides[href] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
            return { label, href };
        });

    const [isOpenSidebar, setIsOpenSidebar] = useState(false)

    return (
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-8 shrink-0">
            <div className="flex items-center gap-4">
                <Sheet open={isOpenSidebar} onOpenChange={setIsOpenSidebar}>
                    <SheetTrigger asChild>
                        <button className="lg:hidden p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                            <Menu className="size-5" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SheetTitle />
                        <Sidebar className="w-full border-none h-full" onClick={() => setIsOpenSidebar(false)} />
                    </SheetContent>
                </Sheet>

                <nav className="hidden md:flex items-center gap-2 text-sm">
                    <Link
                        href="/dashboard"
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                    >
                        <Home className="size-4" />
                    </Link>

                    {breadcrumbs.length > 0 && (
                        <ChevronRight className="size-4 text-muted-foreground/50" />
                    )}

                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <div key={crumb.label + index} className="flex items-center gap-2">
                                {crumb.href && !isLast ? (
                                    <Link
                                        href={crumb.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={cn(
                                            "transition-colors",
                                            isLast
                                                ? "font-semibold text-primary"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {crumb.label}
                                    </span>
                                )}
                                {!isLast && (
                                    <ChevronRight className="size-4 text-muted-foreground/50" />
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        className="pl-10 w-40 lg:w-64 h-9 bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                        placeholder={t("search")}
                        type="text"
                    />

                </div>

                <button className="sm:hidden p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full transition-colors">
                    <Search className="size-5" />
                </button>

                <button className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full transition-colors relative">
                    <Bell className="size-5" />
                    <span className="absolute top-2 right-2 size-2 bg-destructive rounded-full border-2 border-background"></span>
                </button>
            </div>
        </header>
    );
}
