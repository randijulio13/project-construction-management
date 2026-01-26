"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
    title: ReactNode;
    subtitle?: ReactNode;
    action?: ReactNode;
    className?: string;
    showBackButton?: boolean;
}

export function PageHeader({ title, subtitle, action, className, showBackButton }: PageHeaderProps) {
    const router = useRouter();

    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
            <div className="flex items-center gap-4 flex-1">
                {showBackButton && (
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="size-5" />
                    </Button>
                )}
                <div className="space-y-1 flex-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    {subtitle && (
                        <div className="text-muted-foreground">
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>
            {action && (
                <div className="flex items-center gap-3">
                    {action}
                </div>
            )}
        </div>
    );
}
