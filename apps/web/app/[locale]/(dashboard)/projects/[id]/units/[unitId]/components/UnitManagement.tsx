'use client'

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
    Home,
    Ruler,
    Box,
    Bed,
    Bath,
    Layers,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Info,
    DollarSign,
    Save
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectUnit, ProjectUnitSalesStatus, ProjectUnitConstructionStatus } from "@construction/shared";
import { updateUnit } from "@/app/actions/project";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProgressTimeline } from "./ProgressTimeline";
import { AddProgressLogForm } from "./AddProgressLogForm";
import { AddSalesOrderForm } from "./AddSalesOrderForm";
import { SalesDataCard } from "./SalesDataCard";

interface UnitManagementProps {
    projectId: string;
    unit: ProjectUnit;
}

export function UnitManagement({ projectId, unit }: UnitManagementProps) {
    const t = useTranslations("projects");
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [salesStatus, setSalesStatus] = useState<ProjectUnitSalesStatus>(unit.salesStatus);
    const [constructionStatus, setConstructionStatus] = useState<ProjectUnitConstructionStatus>(unit.constructionStatus);

    const handleUpdateStatus = async (type: 'sales' | 'construction', newValue: string) => {
        if (type === 'sales') setSalesStatus(newValue as ProjectUnitSalesStatus);
        else setConstructionStatus(newValue as ProjectUnitConstructionStatus);

        setIsSubmitting(true);
        const result = await updateUnit(projectId, unit.id.toString(), {
            [type === 'sales' ? 'salesStatus' : 'constructionStatus']: newValue
        });
        setIsSubmitting(false);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.error || "Failed to update status");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: General Info & Specs */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    <Home className="size-6 text-primary" />
                                    {unit.blockNumber}
                                </CardTitle>
                                <CardDescription>{unit.unitType}</CardDescription>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">{t("salesStatus")}</span>
                                    <Select value={salesStatus} onValueChange={(val) => handleUpdateStatus('sales', val)}>
                                        <SelectTrigger className="w-[140px] h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={ProjectUnitSalesStatus.AVAILABLE}>{t("status_AVAILABLE")}</SelectItem>
                                            <SelectItem value={ProjectUnitSalesStatus.BOOKED}>{t("status_BOOKED")}</SelectItem>
                                            <SelectItem value={ProjectUnitSalesStatus.SOLD}>{t("status_SOLD")}</SelectItem>
                                            <SelectItem value={ProjectUnitSalesStatus.BLOCKED}>{t("status_BLOCKED")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">{t("constructionStatus")}</span>
                                    <Select value={constructionStatus} onValueChange={(val) => handleUpdateStatus('construction', val)}>
                                        <SelectTrigger className="w-[140px] h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={ProjectUnitConstructionStatus.NOT_STARTED}>{t("status_NOT_STARTED")}</SelectItem>
                                            <SelectItem value={ProjectUnitConstructionStatus.SUBSTRUCTURE}>{t("status_SUBSTRUCTURE")}</SelectItem>
                                            <SelectItem value={ProjectUnitConstructionStatus.SUPERSTRUCTURE}>{t("status_SUPERSTRUCTURE")}</SelectItem>
                                            <SelectItem value={ProjectUnitConstructionStatus.FINISHING}>{t("status_FINISHING")}</SelectItem>
                                            <SelectItem value={ProjectUnitConstructionStatus.COMPLETED}>{t("status_COMPLETED")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Ruler className="size-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{t("landArea")}</p>
                                    <p className="text-sm font-semibold">{unit.landArea} m²</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Box className="size-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{t("buildingArea")}</p>
                                    <p className="text-sm font-semibold">{unit.buildingArea} m²</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <DollarSign className="size-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{t("price")}</p>
                                    <p className="text-sm font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(unit.price)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Layers className="size-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{t("floors")}</p>
                                    <p className="text-sm font-semibold">{unit.floors}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl border bg-muted/30">
                                <Bed className="size-6 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">{t("bedrooms")}</p>
                                    <p className="text-lg font-bold">{unit.bedrooms}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl border bg-muted/30">
                                <Bath className="size-6 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">{t("bathrooms")}</p>
                                    <p className="text-lg font-bold">{unit.bathrooms}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sales Data Section */}
                {(unit as any).salesOrders && (unit as any).salesOrders.length > 0 && (
                    <SalesDataCard
                        salesOrder={(unit as any).salesOrders.find((o: any) => o.status !== "CANCELLED")}
                    />
                )}

                {/* Construction Progress Card */}
                <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="size-5 text-primary" />
                                {t("constructionProgress")}
                            </CardTitle>
                            <AddProgressLogForm
                                projectId={projectId}
                                unitId={unit.id.toString()}
                                currentProgress={unit.progress}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{unit.progress}% {t("completed")}</span>
                                <span className="text-muted-foreground">Target: 100%</span>
                            </div>
                            <Progress value={unit.progress} className="h-3" />
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">{t("history")}</h4>
                            <ProgressTimeline logs={unit.progressLogs || []} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Actions / History Placeholder */}
            <div className="space-y-6">
                <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">{t("quickActions")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex flex-col">
                            {salesStatus === ProjectUnitSalesStatus.AVAILABLE && (
                                <div className="p-4 border-b">
                                    <AddSalesOrderForm
                                        unitId={unit.id}
                                        unitPrice={unit.price}
                                    />
                                </div>
                            )}
                            <button className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b">
                                <CheckCircle2 className="size-5 text-green-500" />
                                <div>
                                    <p className="text-sm font-semibold">Mark as Full Progress</p>
                                    <p className="text-[10px] text-muted-foreground">Set progress to 100% instantly.</p>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b">
                                <AlertCircle className="size-5 text-amber-500" />
                                <div>
                                    <p className="text-sm font-semibold">Report Issue</p>
                                    <p className="text-[10px] text-muted-foreground">Flag this unit for quality check.</p>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left">
                                <Info className="size-5 text-blue-500" />
                                <div>
                                    <p className="text-sm font-semibold">Print Datasheet</p>
                                    <p className="text-[10px] text-muted-foreground">Download PDF specification sheet.</p>
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
