"use client";

import { Plus, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ProjectDocument } from "@construction/shared";

interface DocumentsListProps {
    documents: ProjectDocument[];
}

export function DocumentsList({ documents }: DocumentsListProps) {
    const t = useTranslations("projects");

    return (
        <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <FileText className="size-5 text-primary" />
                        {t("documents")}
                    </CardTitle>
                    <CardDescription>{t("documentsSubtitle")}</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="gap-2">
                    <Plus className="size-4" />
                    {t("addDocument")}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.length === 0 ? (
                        <div className="col-span-full h-24 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                            {t("noDocuments")}
                        </div>
                    ) : (
                        documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded bg-primary/10 flex items-center justify-center">
                                        <FileText className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{doc.name}</p>
                                        <p className="text-xs text-muted-foreground uppercase">
                                            {doc.fileType}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    {t("open")}
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
