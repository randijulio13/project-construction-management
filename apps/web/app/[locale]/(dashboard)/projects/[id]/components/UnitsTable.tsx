"use client";

import { Plus, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ProjectUnit } from "@construction/shared";
import { AddUnitForm } from "./AddUnitForm";

interface UnitsTableProps {
    projectId: number;
    siteplan: string | null;
    units: ProjectUnit[];
}

export function UnitsTable({ projectId, siteplan, units }: UnitsTableProps) {
    const t = useTranslations("projects");

    return (
        <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Home className="size-5 text-primary" />
                        {t("units")}
                    </CardTitle>
                    <CardDescription>{t("unitsSubtitle")}</CardDescription>
                </div>
                <AddUnitForm
                    projectId={projectId}
                    siteplan={siteplan}
                    units={units}
                />
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>{t("unitName")}</TableHead>
                                <TableHead>{t("blockNumber")}</TableHead>
                                <TableHead>{t("unitType")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {units.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        {t("noUnits")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                units.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell className="font-medium">{unit.name}</TableCell>
                                        <TableCell>{unit.blockNumber}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{unit.unitType}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
