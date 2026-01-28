"use client";

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
import { MapPin, Eye } from "lucide-react";
import { Project } from "@construction/shared";
import Image from "next/image";
import { API_URL } from "@/lib/constants";

interface ProjectDataTableProps {
    projects: Project[];
    isLoading: boolean;
}

export function ProjectDataTable({ projects, isLoading }: ProjectDataTableProps) {

    const t = useTranslations("projects");

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
        <div className="border rounded-xl bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[80px]">Logo</TableHead>
                        <TableHead className="min-w-[200px]">{t("name")}</TableHead>
                        <TableHead>{t("status")}</TableHead>
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
                                <TableCell>
                                    <div className="relative size-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
                                        {project.logo ? (
                                            <Image
                                                src={API_URL + project.logo}
                                                alt={project.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="text-muted-foreground text-[10px] font-bold uppercase">
                                                {project.name.substring(0, 2)}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
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
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/projects/${project.id}`}>
                                            <Button variant="ghost" size="icon" title={t("details")}>
                                                <Eye className="size-4" />
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
    );
}
