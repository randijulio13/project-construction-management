"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createProject } from "@/app/actions/project";
import { MapPicker } from "@/components/MapPicker";

import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, CreateProjectInput, CreateProjectOutput } from "@construction/shared";

export function ProjectForm() {
    const t = useTranslations("projects");
    const tVal = useTranslations("validation");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
    };

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CreateProjectInput>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            status: "Draft",
        }
    });

    const watchedLat = useWatch({ control, name: "latitude" });
    const watchedLng = useWatch({ control, name: "longitude" });

    const onSubmit: SubmitHandler<CreateProjectInput> = async (data) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            if (logoFile) {
                formData.append("logo", logoFile);
            }

            const result = await createProject(formData);

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
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="shrink-0 space-y-2">
                        <label className="text-sm font-medium">{t("logo")}</label>
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center bg-muted/30 overflow-hidden relative transition-colors group-hover:bg-muted/50">
                                {logoPreview ? (
                                    <Image
                                        src={logoPreview}
                                        alt="Logo Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <>
                                        <ImageIcon className="size-8 text-muted-foreground mb-1" />
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Logo</span>
                                    </>
                                )}
                                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 text-white">
                                        <Upload className="size-5" />
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                </label>
                            </div>
                            {logoPreview && (
                                <button
                                    type="button"
                                    onClick={removeLogo}
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="size-3" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-6">
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


                            <div className="space-y-3 col-span-full">
                                <label className="text-sm font-medium">{t("location")}</label>
                                <Controller
                                    name="latitude"
                                    control={control}
                                    render={() => (
                                        <MapPicker
                                            value={watchedLat && watchedLng ? { lat: Number(watchedLat), lng: Number(watchedLng) } : undefined}
                                            onChange={(val) => {
                                                setValue("latitude", val.lat, { shouldValidate: true });
                                                setValue("longitude", val.lng, { shouldValidate: true });
                                            }}
                                        />
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">{t("lat")}</label>
                                        <Input
                                            placeholder={t("lat")}
                                            {...register("latitude")}
                                            type="number"
                                            step="any"
                                            className={errors.latitude ? 'border-destructive' : ''}
                                        />
                                        {errors.latitude && <p className="text-[10px] text-destructive font-medium">{tVal(errors.latitude.message as string)}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">{t("long")}</label>
                                        <Input
                                            placeholder={t("long")}
                                            {...register("longitude")}
                                            type="number"
                                            step="any"
                                            className={errors.longitude ? 'border-destructive' : ''}
                                        />
                                        {errors.longitude && <p className="text-[10px] text-destructive font-medium">{tVal(errors.longitude.message as string)}</p>}
                                    </div>
                                </div>
                            </div>
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
