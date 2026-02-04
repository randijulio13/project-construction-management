'use client'

import { Plus, Home, Eye } from "lucide-react";
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
import Link from "next/link";
import { usePathname } from "@/i18n/routing";

interface UnitsTableProps {
    projectId: number;
    siteplan: string | null;
    siteplanConfig: Record<string, number> | null;
    units: ProjectUnit[];
}

export function UnitsTable({ projectId, siteplan, siteplanConfig, units }: UnitsTableProps) {
    const t = useTranslations("projects");
    const pathname = usePathname();

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
                    siteplanConfig={siteplanConfig}
                    units={units}
                />
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>{t("blockNumber")}</TableHead>
                                <TableHead>{t("unitType")}</TableHead>
                                <TableHead>{t("salesStatus")}</TableHead>
                                <TableHead>{t("constructionStatus")}</TableHead>
                                <TableHead>{t("progress")}</TableHead>
                                <TableHead className="text-right">{t("actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {units.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        {t("noUnits")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                units.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell className="font-medium">{unit.blockNumber}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{unit.unitType}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    LB: {unit.buildingArea} / LT: {unit.landArea} m²
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    unit.salesStatus === "AVAILABLE" ? "default" :
                                                        unit.salesStatus === "BOOKED" ? "secondary" :
                                                            unit.salesStatus === "SOLD" ? "outline" : "destructive"
                                                }
                                                className="text-[10px] font-semibold"
                                            >
                                                {t(`status_${unit.salesStatus}`)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] font-semibold bg-primary/5 border-primary/20 text-primary"
                                            >
                                                {t(`status_${unit.constructionStatus}`)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all"
                                                        style={{ width: `${unit.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-medium">{unit.progress}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`${pathname}/units/${unit.id}`}>
                                                    <Eye className="size-4" />
                                                </Link>
                                            </Button>
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
