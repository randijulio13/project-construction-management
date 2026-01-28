'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Plus, Layout, Info } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
    createProjectUnitSchema,
    CreateProjectUnitInput,
    ProjectUnit
} from "@construction/shared";
import { createProjectUnit } from "@/app/actions/project";
import { cn } from "@/lib/utils";

interface AddUnitFormProps {
    projectId: number;
    siteplan: string | null;
    units: ProjectUnit[];
}

export function AddUnitForm({ projectId, siteplan, units }: AddUnitFormProps) {
    const t = useTranslations("projects");
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [isLoadingSvg, setIsLoadingSvg] = useState(false);
    const [hoveredInfo, setHoveredInfo] = useState<{ id: string, name?: string } | null>(null);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Memoize occupied selectors
    const occupiedSelectors = useMemo(() => {
        const set = new Set<string>();
        units.forEach(u => {
            if (u.siteplanSelector) set.add(u.siteplanSelector);
        });
        return set;
    }, [units]);

    const unitMap = useMemo(() => {
        const map = new Map<string, ProjectUnit>();
        units.forEach(u => map.set(u.id.toString(), u));
        return map;
    }, [units]);

    const selectorToUnitMap = useMemo(() => {
        const map = new Map<string, ProjectUnit>();
        units.forEach(u => {
            if (u.siteplanSelector) map.set(u.siteplanSelector, u);
        });
        return map;
    }, [units]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateProjectUnitInput>({
        resolver: zodResolver(createProjectUnitSchema),
        defaultValues: {
            projectId,
            landArea: 0,
            siteplanSelector: null,
        },
    });

    const currentSelector = watch("siteplanSelector");

    // ... rest of the component remains the same ...

    // Fetch SVG
    useEffect(() => {
        if (!open || !siteplan) return;

        const fetchSvg = async () => {
            setIsLoadingSvg(true);
            try {
                const response = await fetch(`${siteplan}?t=${Date.now()}`);
                const text = await response.text();
                if (text.includes("<svg")) {
                    setSvgContent(text);
                }
            } catch (error) {
                console.error("Error fetching siteplan SVG:", error);
            } finally {
                setIsLoadingSvg(false);
            }
        };
        fetchSvg();
    }, [open, siteplan]);

    // Handle SVG injection and events
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper || !svgContent) return;

        wrapper.innerHTML = "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, "image/svg+xml");
        const svg = doc.querySelector("svg");

        if (!svg) {
            wrapper.innerHTML = svgContent;
            return;
        }

        // Style elements
        const graphicTagNames = ['path', 'rect', 'polygon', 'circle', 'ellipse', 'polyline'];
        graphicTagNames.forEach(tag => {
            const elements = svg.querySelectorAll(tag);
            elements.forEach((el, index) => {
                const selector = `${tag}:${index}`;
                const target = el as SVGElement;

                if (occupiedSelectors.has(selector)) {
                    target.classList.add("occupied");
                    const unit = selectorToUnitMap.get(selector);
                    if (unit) {
                        target.setAttribute("data-unit-id", unit.id.toString());
                    }
                }

                if (selector === currentSelector) {
                    target.classList.add("selected-area");
                }
            });
        });

        wrapper.appendChild(svg);

        const handleClick = (e: MouseEvent) => {
            const target = e.target as SVGElement;
            const tagName = target.tagName.toLowerCase();
            if (!graphicTagNames.includes(tagName)) return;

            const elements = svg.querySelectorAll(tagName);
            let index = -1;
            for (let i = 0; i < elements.length; i++) {
                if (elements[i] === target) {
                    index = i;
                    break;
                }
            }

            if (index === -1) return;
            const selector = `${tagName}:${index}`;

            if (occupiedSelectors.has(selector)) {
                return; // Cannot select occupied
            }

            if (selector === currentSelector) {
                setValue("siteplanSelector", null);
            } else {
                setValue("siteplanSelector", selector);
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as SVGElement;
            if (!graphicTagNames.includes(target.tagName.toLowerCase())) return;

            const unitId = target.getAttribute("data-unit-id");
            target.classList.add("hovered");

            let name = t("noUnitAssigned");
            if (unitId) {
                const unit = unitMap.get(unitId);
                if (unit) name = unit.blockNumber;
            }

            setHoveredInfo({ id: unitId || "Area", name });
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as SVGElement;
            target.classList.remove("hovered");
            setHoveredInfo(null);
        };

        wrapper.addEventListener("click", handleClick);
        wrapper.addEventListener("mouseover", handleMouseOver);
        wrapper.addEventListener("mouseout", handleMouseOut);

        return () => {
            wrapper.removeEventListener("click", handleClick);
            wrapper.removeEventListener("mouseover", handleMouseOver);
            wrapper.removeEventListener("mouseout", handleMouseOut);
        };
    }, [svgContent, currentSelector, occupiedSelectors, t, unitMap, selectorToUnitMap, setValue]);

    const onSubmit = (async (data: CreateProjectUnitInput) => {
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
    }) as any;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                    <Plus className="size-4" />
                    {t("addUnit")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("addUnit")}</DialogTitle>
                    <DialogDescription>{t("unitsSubtitle")}</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {/* Siteplan Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Layout className="size-4" />
                                {t("selectAreaOnSiteplan")}
                            </label>
                            {currentSelector && (
                                <Badge variant="secondary" className="text-[10px]">
                                    {currentSelector}
                                </Badge>
                            )}
                        </div>

                        <div
                            className={cn(
                                "rounded-lg border bg-muted/30 h-auto aspect-square flex items-center justify-center relative group overflow-hidden transition-all duration-300",
                                hoveredInfo && "ring-1 ring-primary/20 bg-muted/50"
                            )}
                        >
                            {svgContent ? (
                                <div
                                    ref={wrapperRef}
                                    className="w-full h-full flex items-center justify-center selection-mode"
                                />
                            ) : isLoadingSvg ? (
                                <div className="text-muted-foreground animate-pulse text-xs">Loading SVG...</div>
                            ) : (
                                <div className="text-muted-foreground text-xs">{t("noSiteplanAvailable")}</div>
                            )}

                            {hoveredInfo && (
                                <div className="absolute top-2 left-2 right-2 bg-background/80 backdrop-blur-sm border rounded px-2 py-1 text-[10px] flex items-center gap-1.5 z-50">
                                    <Info className="size-3" />
                                    {hoveredInfo.name}
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">
                            * Klik area pada siteplan untuk menautkan unit baru dengan posisi visual.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input type="hidden" {...register("projectId", { valueAsNumber: true })} />
                        <input type="hidden" {...register("siteplanSelector")} />

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
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
                                        placeholder="e.g. Tipe 36"
                                        className={cn(errors.unitType && "border-destructive")}
                                    />
                                    {errors.unitType && (
                                        <p className="text-xs text-destructive">{t(errors.unitType.message as any)}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-start gap-2">{t("landArea")}<pre className="text-xs">m2</pre></label>
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

                        <div className="pt-6 flex justify-end gap-2 border-t">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                                {t("cancel")}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "..." : t("saveUnit")}
                            </Button>
                        </div>
                    </form>
                </div>
                <style jsx global>{`
                    .selection-mode svg {
                        width: 100%;
                        height: auto;
                        max-height: 50vh;
                        display: block;
                    }
                    
                    .selection-mode path,
                    .selection-mode rect,
                    .selection-mode polygon,
                    .selection-mode circle,
                    .selection-mode ellipse,
                    .selection-mode polyline {
                        transition: all 0.2s ease;
                        pointer-events: all;
                    }

                    .selection-mode path:hover,
                    .selection-mode rect:hover,
                    .selection-mode polygon:hover,
                    .selection-mode circle:hover,
                    .selection-mode ellipse:hover,
                    .selection-mode polyline:hover {
                        cursor: pointer;
                        filter: brightness(1.2);
                        stroke: hsl(var(--primary));
                        stroke-width: 2px;
                    }

                    .selection-mode .occupied {
                        fill: #94a3b8 !important;
                        fill-opacity: 0.3 !important;
                        stroke: #64748b !important;
                        cursor: not-allowed !important;
                    }

                    .selection-mode .occupied:hover {
                        filter: none !important;
                        stroke-width: 1px !important;
                    }

                    .selection-mode .selected-area {
                        fill: hsl(var(--primary)) !important;
                        fill-opacity: 0.8 !important;
                        stroke: hsl(var(--primary)) !important;
                        stroke-width: 3px !important;
                    }

                    .selection-mode .hovered {
                         stroke: hsl(var(--primary)) !important;
                         stroke-width: 3px !important;
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    );
}
