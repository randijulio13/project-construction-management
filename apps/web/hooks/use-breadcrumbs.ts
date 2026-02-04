"use client";

import { useEffect } from "react";
import { useBreadcrumbContext } from "@/components/BreadcrumbProvider";

export function useBreadcrumbs(path: string, label: string | undefined) {
    const { setOverride, removeOverride } = useBreadcrumbContext();

    useEffect(() => {
        if (label) {
            setOverride(path, label);
        } else {
            removeOverride(path);
        }

        return () => {
            removeOverride(path);
        };
    }, [path, label, setOverride, removeOverride]);
}
