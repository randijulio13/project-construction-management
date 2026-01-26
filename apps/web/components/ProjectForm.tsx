"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createProject } from "@/app/actions/project";

export function ProjectForm() {
    const t = useTranslations("projects");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        description: "",
        status: "Draft",
        startDate: "",
        endDate: "",
        latitude: "",
        longitude: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
            };

            const result = await createProject(payload);

            if (result.success) {
                router.push("/projects");
            } else {
                // In a real app, we might want to show a toast here
                console.error("Error creating project:", result.error);
                alert(result.error);
            }
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-full">
                        <label className="text-sm font-medium">{t("name")}</label>
                        <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={t("namePlaceholder")}
                        />
                    </div>

                    <div className="space-y-2 col-span-full">
                        <label className="text-sm font-medium">{t("address")}</label>
                        <Textarea
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder={t("addressPlaceholder")}
                        />
                    </div>

                    <div className="space-y-2 col-span-full">
                        <label className="text-sm font-medium">{t("description")}</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder={t("descriptionPlaceholder")}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t("status")}</label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: string) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t("statusPlaceholder")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">{t("statusDraft")}</SelectItem>
                                <SelectItem value="Active">{t("statusActive")}</SelectItem>
                                <SelectItem value="Completed">{t("statusCompleted")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 col-span-full md:col-span-1">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("startDate")}</label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("endDate")}</label>
                            <Input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t("location")} ({t("lat")}/{t("long")})</label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder={t("lat")}
                                value={formData.latitude}
                                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                            />
                            <Input
                                placeholder={t("long")}
                                value={formData.longitude}
                                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-muted/30 p-4 border-t flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                    {t("cancel")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? t("saving") : t("save")}
                </Button>
            </div>
        </form>
    );
}
