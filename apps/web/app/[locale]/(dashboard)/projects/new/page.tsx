"use client";

import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ProjectForm } from "./components/ProjectForm";

export default function NewProjectPage() {
    const t = useTranslations("projects");
    const router = useRouter();

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="size-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t("new")}</h1>
                    <p className="text-muted-foreground">{t("newSubtitle")}</p>
                </div>
            </div>

            <ProjectForm />
        </div>
    );
}
