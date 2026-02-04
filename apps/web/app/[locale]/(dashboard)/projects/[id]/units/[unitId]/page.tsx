import { getProjectById, getUnitById } from "@/app/actions/project";
import { notFound } from "next/navigation";
import { ProjectHeader } from "../../components/ProjectHeader";
import PageWrapper from "@/components/PageWrapper";
import { UnitManagement } from "./components/UnitManagement";
import { BreadcrumbSetter } from "@/components/BreadcrumbSetter";

export default async function UnitDetailPage({
    params,
}: {
    params: Promise<{ id: string; unitId: string }>;
}) {
    const { id, unitId } = await params;

    const [project, unit] = await Promise.all([
        getProjectById(id),
        getUnitById(id, unitId)
    ]);

    if (!project || !unit) {
        notFound();
    }

    return (
        <PageWrapper>
            <div className="flex flex-col gap-8 flex-1 overflow-visible">
                <BreadcrumbSetter path={`/projects/${id}`} label={project.name} />
                <BreadcrumbSetter path={`/projects/${id}/units/${unitId}`} label={unit.blockNumber} />

                <ProjectHeader project={project} />

                <UnitManagement projectId={id} unit={unit} />
            </div>
        </PageWrapper>
    );
}
