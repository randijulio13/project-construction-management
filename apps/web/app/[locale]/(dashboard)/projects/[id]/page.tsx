import { Project, ProjectDocument, ProjectUnit } from "@construction/shared";
import { getProjectById } from "@/app/actions/project";
import { API_URL } from "@/lib/constants";
import { notFound } from "next/navigation";

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

export default async function ProjectDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = (await getProjectById(id)) as ProjectWithRelations | null;

    if (!project) {
        notFound();
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <ProjectHeader project={project} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details & Sub-data */}
                <div className="lg:col-span-2 space-y-8">
                    <DigitalSiteplan
                        projectId={project.id}
                        siteplan={project.siteplan ? `${API_URL}${project.siteplan}` : null}
                        siteplanConfig={project.siteplanConfig || null}
                        units={project.units || []}
                    />
                    <UnitsTable
                        projectId={project.id}
                        siteplan={project.siteplan ? `${API_URL}${project.siteplan}` : null}
                        siteplanConfig={project.siteplanConfig || null}
                        units={project.units || []}
                    />
                    <DocumentsList documents={project.documents || []} />
                </div>

                {/* Right Column - Brief Stats/Info */}
                <div className="space-y-8">
                    {project.latitude !== null && project.longitude !== null && (
                        <ProjectMap
                            latitude={Number(project.latitude)}
                            longitude={Number(project.longitude)}
                            name={project.name}
                            address={project.address}
                        />
                    )}
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
