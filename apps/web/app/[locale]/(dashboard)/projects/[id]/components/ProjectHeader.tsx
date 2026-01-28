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

    console.log(API_URL, project.logo, `${API_URL}${project.logo}`)
    return (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 w-full">
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
                                unoptimized={true}
                                src={`${API_URL}${project.logo}`}
                                alt={project.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="size-4" />
                            {project.address}
                        </span>
                    </div>
                    <Badge variant={project.status === "Active" ? "default" : "secondary"} className="me-4">
                        {project.status}
                    </Badge>
                </div>

            </div>
        </div>
    );
}
