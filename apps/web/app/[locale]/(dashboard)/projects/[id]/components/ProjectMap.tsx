"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { MapPin, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const MapContent = dynamic(() => import("./ProjectMapContent"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] relative overflow-hidden rounded-lg border bg-muted/30">
            <Skeleton className="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-muted-foreground animate-pulse">
                        Loading map...
                    </span>
                </div>
            </div>
        </div>
    ),
});

interface ProjectMapProps {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
}

export function ProjectMap({
    latitude,
    longitude,
    name,
    address,
}: ProjectMapProps) {
    const t = useTranslations("projects");

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    return (
        <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <MapPin className="size-5 text-primary" />
                        {t("map")}
                    </CardTitle>
                    <CardDescription>{address}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full rounded-lg overflow-hidden border relative z-0">
                    <MapContent latitude={latitude} longitude={longitude} name={name} />
                </div>

            </CardContent>
            <CardFooter>

                <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 w-full"
                    onClick={() => window.open(googleMapsUrl, "_blank")}
                >
                    <ExternalLink className="size-4" />
                    {t("viewOnGoogleMaps")}
                </Button>
            </CardFooter>
        </Card>
    );
}
