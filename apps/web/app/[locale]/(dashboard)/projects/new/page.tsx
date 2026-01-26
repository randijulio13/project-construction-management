"use client";

import { useTranslations } from "next-intl";
import { ProjectForm } from "./components/ProjectForm";
import { PageHeader } from "@/components/PageHeader";

export default function NewProjectPage() {
    const t = useTranslations("projects");

    return (
        <div className="p-8 mx-auto space-y-8">
            <PageHeader
                title={t("new")}
                subtitle={t("newSubtitle")}
                showBackButton
            />

            <ProjectForm />
        </div>
    );
}
