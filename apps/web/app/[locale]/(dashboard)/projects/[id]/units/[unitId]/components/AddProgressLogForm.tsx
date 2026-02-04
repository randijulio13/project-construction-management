'use client'

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectUnitProgressSchema } from "@construction/shared";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Plus, Loader2 } from "lucide-react";
import { addProgressLog } from "@/app/actions/project";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface AddProgressLogFormProps {
    projectId: string;
    unitId: string;
    currentProgress: number;
}

export function AddProgressLogForm({ projectId, unitId, currentProgress }: AddProgressLogFormProps) {
    const t = useTranslations("projects");
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(createProjectUnitProgressSchema),
        defaultValues: {
            unitId: parseInt(unitId),
            percentage: currentProgress,
            notes: "",
        },
    });

    async function onSubmit(values: any) {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("percentage", values.percentage.toString());
        formData.append("notes", values.notes);

        const photoFile = (document.getElementById("photo-upload") as HTMLInputElement)?.files?.[0];
        if (photoFile) {
            formData.append("photo", photoFile);
        }

        const result = await addProgressLog(projectId, unitId, formData);
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Progress log added successfully");
            setOpen(false);
            form.reset();
            setPreview(null);
            router.refresh();
        } else {
            toast.error(result.error || "Failed to add progress log");
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="size-4" />
                    {t("addProgressLog")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t("addNewProgress")}</DialogTitle>
                    <DialogDescription>
                        {t("addProgressDescription")}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="percentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("progress")} (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel>{t("photoEvidence")}</FormLabel>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full flex-col h-24 gap-2 border-dashed"
                                        onClick={() => document.getElementById("photo-upload")?.click()}
                                    >
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="h-full object-contain" />
                                        ) : (
                                            <>
                                                <Camera className="size-6 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">Upload Photo</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("notes")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t("notesPlaceholder")}
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                {t("cancel")}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("saveProgress")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
