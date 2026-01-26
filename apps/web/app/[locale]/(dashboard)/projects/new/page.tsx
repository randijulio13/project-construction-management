"use client";

import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
import { ChevronLeft } from "lucide-react";

export default function NewProjectPage() {
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
            const response = await fetch("http://localhost:4000/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    ...formData,
                    latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                    longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
                }),
            });

            if (response.ok) {
                router.push("/projects");
            }
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="size-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t("new")}</h1>
                    <p className="text-muted-foreground">Isi detail proyek secara lengkap.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-full">
                            <label className="text-sm font-medium">{t("name")}</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Masukkan nama proyek"
                            />
                        </div>

                        <div className="space-y-2 col-span-full">
                            <label className="text-sm font-medium">{t("address")}</label>
                            <Textarea
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Alamat lengkap proyek"
                            />
                        </div>

                        <div className="space-y-2 col-span-full">
                            <label className="text-sm font-medium">{t("description")}</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Keterangan opsional"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("status")}</label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: string) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Active">Aktif</SelectItem>
                                    <SelectItem value="Completed">Selesai</SelectItem>
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
                            <label className="text-sm font-medium">{t("location")} (Lat/Long)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    placeholder="Lat"
                                    value={formData.latitude}
                                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                />
                                <Input
                                    placeholder="Long"
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
                        {isLoading ? "Saving..." : t("save")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
