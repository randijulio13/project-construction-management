"use client";

import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

interface BreadcrumbSetterProps {
    path: string;
    label: string | undefined;
}

/**
 * A client component that sets a breadcrumb override.
 * Useful for setting breadcrumbs from within Server Components.
 */
export function BreadcrumbSetter({ path, label }: BreadcrumbSetterProps) {
    useBreadcrumbs(path, label);
    return null;
}
