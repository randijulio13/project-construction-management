"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface BreadcrumbContextType {
    overrides: Record<string, string>;
    setOverride: (path: string, label: string) => void;
    removeOverride: (path: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
    const [overrides, setOverrides] = useState<Record<string, string>>({});

    const setOverride = useCallback((path: string, label: string) => {
        setOverrides((prev) => ({ ...prev, [path]: label }));
    }, []);

    const removeOverride = useCallback((path: string) => {
        setOverrides((prev) => {
            const next = { ...prev };
            delete next[path];
            return next;
        });
    }, []);

    return (
        <BreadcrumbContext.Provider value={{ overrides, setOverride, removeOverride }}>
            {children}
        </BreadcrumbContext.Provider>
    );
}

export function useBreadcrumbContext() {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error("useBreadcrumbContext must be used within a BreadcrumbProvider");
    }
    return context;
}
