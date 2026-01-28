"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Project, ProjectDocument, ProjectUnit } from "@construction/shared";
import { getProjectById } from "@/app/actions/project";
import { API_URL } from "@/lib/constants";

// Components
import { ProjectHeader } from "./components/ProjectHeader";
import { UnitsTable } from "./components/UnitsTable";
import { DocumentsList } from "./components/DocumentsList";
import { ProjectStats } from "./components/ProjectStats";
import { ProjectMap } from "./components/ProjectMap";
import { DigitalSiteplan } from "./components/DigitalSiteplan";

interface ProjectWithRelations extends Project {
    documents: ProjectDocument[];
    units: ProjectUnit[];
}

export default function ProjectDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const t = useTranslations("projects");
    const router = useRouter();
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
                <Button variant="link" onClick={() => router.push("/projects")}>
                    {" "}
                    {t("backToList")}{" "}
                </Button>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <ProjectHeader project={project} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details & Sub-data */}
                <div className="lg:col-span-2 space-y-8">
                    {project.latitude !== null && project.longitude !== null && (
                        <ProjectMap
                            latitude={Number(project.latitude)}
                            longitude={Number(project.longitude)}
                            name={project.name}
                            address={project.address}
                        />
                    )}
                    <DigitalSiteplan
                        projectId={project.id}
                        siteplan={project.siteplan ? `${API_URL}${project.siteplan}` : null}
                    />
                    <UnitsTable units={project.units || []} />
                    <DocumentsList documents={project.documents || []} />
                </div>

                {/* Right Column - Brief Stats/Info */}
                <div className="space-y-8">
                    <ProjectStats
                        project={{
                            ...project,
                            units: project.units || [],
                            documents: project.documents || [],
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
