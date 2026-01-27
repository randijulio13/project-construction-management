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

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, CreateProjectInput, CreateProjectOutput } from "@construction/shared";

export function ProjectForm() {
    const t = useTranslations("projects");
    const tVal = useTranslations("validation");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreateProjectInput>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            status: "Draft",
        }
    });

    const onSubmit: SubmitHandler<CreateProjectInput> = async (data) => {
        setIsLoading(true);

        try {
            // data is actually transformed by zodResolver
            const validatedData = data as unknown as CreateProjectOutput;
            const result = await createProject(validatedData);

            if (result.success) {
                router.push("/projects");
            } else {
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
        <form onSubmit={handleSubmit(onSubmit)} className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-full">
                        <label className="text-sm font-medium">{t("name")}</label>
                        <Input
                            {...register("name")}
                            className={errors.name ? 'border-destructive' : ''}
                            placeholder={t("namePlaceholder")}
                        />
                        {errors.name && <p className="text-xs text-destructive font-medium">{tVal(errors.name.message as string)}</p>}
                    </div>

                    <div className="space-y-2 col-span-full">
                        <label className="text-sm font-medium">{t("address")}</label>
                        <Textarea
                            {...register("address")}
                            className={errors.address ? 'border-destructive' : ''}
                            placeholder={t("addressPlaceholder")}
                        />
                        {errors.address && <p className="text-xs text-destructive font-medium">{tVal(errors.address.message as string)}</p>}
                    </div>

                    <div className="space-y-2 col-span-full">
                        <label className="text-sm font-medium">{t("description")}</label>
                        <Textarea
                            {...register("description")}
                            placeholder={t("descriptionPlaceholder")}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t("status")}</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
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
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 col-span-full md:col-span-1">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("startDate")}</label>
                            <Input
                                type="date"
                                {...register("startDate")}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("endDate")}</label>
                            <Input
                                type="date"
                                {...register("endDate")}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t("location")} ({t("lat")}/{t("long")})</label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder={t("lat")}
                                {...register("latitude")}
                            />
                            <Input
                                placeholder={t("long")}
                                {...register("longitude")}
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
