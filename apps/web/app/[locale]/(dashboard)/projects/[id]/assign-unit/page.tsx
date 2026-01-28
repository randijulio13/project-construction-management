"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, use } from "react";
import { Project, ProjectDocument, ProjectUnit } from "@construction/shared";
import { getProjectById } from "@/app/actions/project";
import { API_URL } from "@/lib/constants";
import { AssignUnitSiteplan } from "../components/AssignUnitSiteplan";
import { ProjectHeader } from "../components/ProjectHeader";

interface ProjectWithRelations extends Project {
    documents: ProjectDocument[];
    units: ProjectUnit[];
}

export default function AssignUnitPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const t = useTranslations("projects");
    const [project, setProject] = useState<ProjectWithRelations | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProjectById(resolvedParams.id);
                if (data) {
                    setProject(data as ProjectWithRelations);
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
                <p className="text-muted-foreground animate-pulse">{t("loading")}</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="p-8 text-center space-y-4">
                <h2 className="text-xl font-bold">{t("notFound")}</h2>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <ProjectHeader project={project} />

            <div className="grid grid-cols-1 gap-8">
                <AssignUnitSiteplan
                    projectId={project.id}
                    siteplan={project.siteplan ? `${API_URL}${project.siteplan}` : null}
                    units={project.units || []}
                />
            </div>
        </div>
    );
}
