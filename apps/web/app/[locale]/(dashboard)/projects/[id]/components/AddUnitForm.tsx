"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createProjectUnitSchema, CreateProjectUnitInput } from "@construction/shared";
import { createProjectUnit } from "@/app/actions/project";
import { cn } from "@/lib/utils";

interface AddUnitFormProps {
    projectId: number;
}

export function AddUnitForm({ projectId }: AddUnitFormProps) {
    const t = useTranslations("projects");
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateProjectUnitInput>({
        resolver: zodResolver(createProjectUnitSchema),
        defaultValues: {
            projectId,
            landArea: 0,
        },
    });

    const onSubmit = async (data: CreateProjectUnitInput) => {
        setIsSubmitting(true);
        const result = await createProjectUnit(projectId.toString(), data);
        setIsSubmitting(false);

        if (result.success) {
            setOpen(false);
            reset();
            router.refresh();
        } else {
            alert(result.error || t("unitAddFailed"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                    <Plus className="size-4" />
                    {t("addUnit")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("addUnit")}</DialogTitle>
                    <DialogDescription>{t("unitsSubtitle")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <input type="hidden" {...register("projectId", { valueAsNumber: true })} />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium">{t("unitName")}</label>
                            <Input
                                {...register("name")}
                                placeholder="e.g. Type 36 Standard"
                                className={cn(errors.name && "border-destructive")}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">{t(errors.name.message as any)}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("blockNumber")}</label>
                            <Input
                                {...register("blockNumber")}
                                placeholder="e.g. A-12"
                                className={cn(errors.blockNumber && "border-destructive")}
                            />
                            {errors.blockNumber && (
                                <p className="text-xs text-destructive">{t(errors.blockNumber.message as any)}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("unitType")}</label>
                            <Input
                                {...register("unitType")}
                                placeholder="e.g. Kavling / Rumah"
                                className={cn(errors.unitType && "border-destructive")}
                            />
                            {errors.unitType && (
                                <p className="text-xs text-destructive">{t(errors.unitType.message as any)}</p>
                            )}
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium">{t("landArea")}</label>
                            <Input
                                type="number"
                                step="0.01"
                                {...register("landArea", { valueAsNumber: true })}
                                className={cn(errors.landArea && "border-destructive")}
                            />
                            {errors.landArea && (
                                <p className="text-xs text-destructive">{t(errors.landArea.message as any)}</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "..." : t("saveUnit")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
