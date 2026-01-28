import { getTranslations } from "next-intl/server";
import { Project, ProjectDocument, ProjectUnit } from "@construction/shared";
import { getProjectById } from "@/app/actions/project";
import { API_URL } from "@/lib/constants";
import { AssignUnitSiteplan } from "../components/AssignUnitSiteplan";
import { ProjectHeader } from "../components/ProjectHeader";
import { notFound } from "next/navigation";

interface ProjectWithRelations extends Project {
    documents: ProjectDocument[];
    units: ProjectUnit[];
}

export default async function AssignUnitPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const t = await getTranslations("projects");

    const project = (await getProjectById(resolvedParams.id)) as ProjectWithRelations | null;

    if (!project) {
        notFound();
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <ProjectHeader project={project} />

            <div className="grid grid-cols-1 gap-8">
                <AssignUnitSiteplan
                    projectId={project.id}
                    siteplan={project.siteplan ? `${API_URL}${project.siteplan}` : null}
                    siteplanConfig={project.siteplanConfig || null}
                    units={project.units || []}
                />
            </div>
        </div>
    );
}
