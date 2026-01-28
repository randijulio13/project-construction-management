"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProjects } from "@/app/actions/project";
import { Project } from "@construction/shared";
import { PageHeader } from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";
import { ProjectDataTable } from "./components/ProjectDataTable";

export default function ProjectsPage() {
    const t = useTranslations("projects");
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <ProjectDataTable projects={filteredProjects} isLoading={isLoading} />
        </PageWrapper>
    );
}
