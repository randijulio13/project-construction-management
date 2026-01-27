"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProjects } from "@/app/actions/project";
import { Project } from "@construction/shared";
import { PageHeader } from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";

// Local interface removed in favor of shared type

export default function ProjectsPage() {
    const t = useTranslations("projects");
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "default";
            case "completed":
                return "secondary";
            case "draft":
                return "outline";
            default:
                return "outline";
        }
    };

    return (
        <PageWrapper>
            <PageHeader
                title={t("list")}
                subtitle="Manajemen dan monitoring progress seluruh proyek konstruksi."
                action={
                    <Link href="/projects/new">
                        <Button className="flex items-center gap-2">
                            <Plus className="size-4" />
                            {t("new")}
                        </Button>
                    </Link>
                }
            />

            <div className="flex items-center gap-4 py-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder={t("search") || "Cari proyek..."}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="border rounded-xl bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[300px]">{t("name")}</TableHead>
                            <TableHead>{t("status")}</TableHead>
                            <TableHead>{t("timeline") || "Timeline"}</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Memuat data...
                                </TableCell>
                            </TableRow>
                        ) : projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    {t("noProjects")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            projects.map((project) => (
                                <TableRow key={project.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{project.name}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <MapPin className="size-3" />
                                                {project.address}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(project.status)}>
                                            {project.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="size-3" />
                                            {project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}
                                            <span>→</span>
                                            {project.endDate ? new Date(project.endDate).toLocaleDateString() : "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/projects/${project.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    {t("details")}
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </PageWrapper>
    );
}
