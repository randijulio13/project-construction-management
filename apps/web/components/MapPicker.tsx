"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MapPickerContent = dynamic(() => import("./MapPickerContent"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[300px] relative overflow-hidden rounded-lg border">
            <Skeleton className="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-muted-foreground animate-pulse">Loading map...</span>
                </div>
            </div>
        </div>
    ),
});

interface MapPickerProps {
    value?: { lat: number; lng: number };
    onChange: (val: { lat: number; lng: number }) => void;
    defaultCenter?: [number, number];
}

export function MapPicker(props: MapPickerProps) {
    return (
        <div className="w-full h-[300px] overflow-hidden rounded-lg border relative z-0">
            <MapPickerContent {...props} />
        </div>
    );
}
