"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, use } from "react";
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
import {
    Plus,
    FileText,
    Home,
    MapPin,
    Calendar,
    ChevronLeft,
    Monitor,
    Clock,
} from "lucide-react";

interface Document {
    id: number;
    name: string;
    fileUrl: string;
    fileType: string;
}

interface Unit {
    id: number;
    name: string;
    blockNumber: string;
    unitType: string;
}

interface Project {
    id: number;
    name: string;
    address: string;
    description: string | null;
    status: string;
    startDate: string | null;
    endDate: string | null;
    latitude: number | null;
    longitude: number | null;
    documents: Document[];
    units: Unit[];
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const t = useTranslations("projects");
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`http://localhost:4000/projects/${resolvedParams.id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setProject(data);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [resolvedParams.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground animate-pulse">Memuat detail proyek...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold">Proyek tidak ditemukan</h2>
                <Button variant="link" onClick={() => router.push("/projects")}> Kembali ke daftar </Button>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
                            <ChevronLeft className="size-5" />
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                        <Badge variant={project.status === "Active" ? "default" : "secondary"}>
                            {project.status}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="size-4" />
                            {project.address}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            {project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"} → {project.endDate ? new Date(project.endDate).toLocaleDateString() : "-"}
                        </span>
                    </div>
                    {project.description && (
                        <p className="text-muted-foreground max-w-2xl">{project.description}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details & Sub-data */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Units Section */}
                    <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Home className="size-5 text-primary" />
                                    {t("units")}
                                </CardTitle>
                                <CardDescription>Manajemen kapling dan unit rumah.</CardDescription>
                            </div>
                            <Button size="sm" variant="outline" className="gap-2">
                                <Plus className="size-4" />
                                {t("addUnit")}
                            </Button>
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
                                        {project.units.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                                    Belum ada unit terdaftar.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            project.units.map((unit) => (
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

                    {/* Documents Section */}
                    <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <FileText className="size-5 text-primary" />
                                    {t("documents")}
                                </CardTitle>
                                <CardDescription>Blue print, legalitas, dan dokumen lainnya.</CardDescription>
                            </div>
                            <Button size="sm" variant="outline" className="gap-2">
                                <Plus className="size-4" />
                                {t("addDocument")}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {project.documents.length === 0 ? (
                                    <div className="col-span-full h-24 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                                        Belum ada dokumen diunggah.
                                    </div>
                                ) : (
                                    project.documents.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded bg-primary/10 flex items-center justify-center">
                                                    <FileText className="size-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground uppercase">{doc.fileType}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm">Buka</Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Brief Stats/Info */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Informasi Tambahan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Unit</span>
                                <span className="font-semibold">{project.units.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Dokumen</span>
                                <span className="font-semibold">{project.documents.length}</span>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-xs font-medium mb-2">Lokasi GPS</p>
                                <div className="text-sm flex items-center gap-1 text-muted-foreground">
                                    <Monitor className="size-3" />
                                    {project.latitude || "-"}, {project.longitude || "-"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Clock className="size-4 text-primary" />
                                Status Pelaksanaan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between text-xs">
                                    <div>Progress</div>
                                    <div className="text-right font-semibold">0%</div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                                    <div style={{ width: "0%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Progress dihitung berdasarkan jumlah unit yang sudah mulai dikerjakan.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
