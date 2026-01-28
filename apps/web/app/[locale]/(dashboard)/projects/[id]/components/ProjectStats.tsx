"use client";

import { Monitor, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Project } from "@construction/shared";

interface ProjectStatsProps {
    project: Project & { units: any[]; documents: any[] };
}

export function ProjectStats({ project }: ProjectStatsProps) {
    const t = useTranslations("projects");

    return (
        <div className="space-y-8">
            {/* <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">{t("additionalInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("totalUnits")}</span>
                        <span className="font-semibold">{project.units.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("totalDocuments")}</span>
                        <span className="font-semibold">{project.documents.length}</span>
                    </div>
                    <div className="pt-4 border-t">
                        <p className="text-xs font-medium mb-2">{t("gpsLocation")}</p>
                        <div className="text-sm flex items-center gap-1 text-muted-foreground">
                            <Monitor className="size-3" />
                            {project.latitude || "-"}, {project.longitude || "-"}
                        </div>
                    </div>
                </CardContent>
            </Card> */}

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Clock className="size-4 text-primary" />
                        {t("executionStatus")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between text-xs">
                            <div>{t("progress")}</div>
                            <div className="text-right font-semibold">0%</div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                            <div
                                style={{ width: "0%" }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                            ></div>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            {t("progressDescription")}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
