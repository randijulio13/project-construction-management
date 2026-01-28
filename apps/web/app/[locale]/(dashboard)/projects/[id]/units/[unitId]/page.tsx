import { getProjectById, getUnitById } from "@/app/actions/project";
import { notFound } from "next/navigation";
import { Home, ChevronRight, Layout, Ruler, Box } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { ProjectHeader } from "../../components/ProjectHeader";
import PageWrapper from "@/components/PageWrapper";

export default async function UnitDetailPage({
    params,
}: {
    params: Promise<{ id: string; unitId: string }>;
}) {
    const { id, unitId } = await params;
    const t = await getTranslations("projects");
    const commonT = await getTranslations("common");

    // Use Promise.all to fetch both project and unit data in parallel
    const [project, unit] = await Promise.all([
        getProjectById(id),
        getUnitById(id, unitId)
    ]);

    console.log({ project, unit })

    if (!project || !unit) {
        notFound();
    }

    return (
        <PageWrapper>

            <ProjectHeader project={project} />


        </PageWrapper>
    );
}
