"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@construction/shared";
import { API_URL } from "@/lib/constants";
import Image from "next/image";

interface ProjectHeaderProps {
    project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="size-5" />
                    </Button>
                    {project.logo && (
                        <div className="relative size-12 rounded-lg overflow-hidden border bg-muted shrink-0">
                            <Image
                                src={`${API_URL}${project.logo}`}
                                alt={project.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
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
                        {project.startDate
                            ? new Date(project.startDate).toLocaleDateString()
                            : "-"}{" "}
                        →{" "}
                        {project.endDate
                            ? new Date(project.endDate).toLocaleDateString()
                            : "-"}
                    </span>
                </div>
                {project.description && (
                    <p className="text-muted-foreground max-w-2xl">{project.description}</p>
                )}
            </div>
        </div>
    );
}
