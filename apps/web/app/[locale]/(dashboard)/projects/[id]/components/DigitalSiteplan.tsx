import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Layout, Upload, FileType, CheckCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { updateProjectSiteplan } from "@/app/actions/project";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProjectUnit } from "@construction/shared";

interface DigitalSiteplanProps {
    projectId: number;
    siteplan: string | null;
    units: ProjectUnit[];
}

export function DigitalSiteplan({ projectId, siteplan, units }: DigitalSiteplanProps) {
    const t = useTranslations("projects");
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [isLoadingSvg, setIsLoadingSvg] = useState(false);
    const [hoveredInfo, setHoveredInfo] = useState<{ id: string, name?: string } | null>(null);

    // Modal state
    const [selectedElement, setSelectedElement] = useState<SVGElement | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingUnitId, setPendingUnitId] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Memoize unit map for quick lookup
    const unitMap = useMemo(() => {
        const map = new Map<string, ProjectUnit>();
        units.forEach(u => map.set(u.id.toString(), u));
        return map;
    }, [units]);

    // Fetch SVG content to render inline
    useEffect(() => {
        if (!siteplan) {
            setSvgContent(null);
            return;
        }

        const fetchSvg = async () => {
            setIsLoadingSvg(true);
            try {
                const response = await fetch(`${siteplan}?t=${Date.now()}`);
                const text = await response.text();

                if (text.includes("<svg")) {
                    setSvgContent(text);
                } else {
                    console.error("Fetched content is not an SVG");
                    setSvgContent(null);
                }
            } catch (error) {
                console.error("Error fetching siteplan SVG:", error);
                setSvgContent(null);
            } finally {
                setIsLoadingSvg(false);
            }
        };

        fetchSvg();
    }, [siteplan]);

    // Setup native DOM listeners for the injected SVG
    // useEffect(() => {
    //     const wrapper = wrapperRef.current;
    //     if (!wrapper || !svgContent) return;

    //     const handleClick = (e: MouseEvent) => {
    //         console.log('oke')
    //         let target = e.target as SVGElement;

    //         // Find the closest graphic element if we clicked on something deep
    //         const graphicTagNames = ['path', 'rect', 'polygon', 'circle', 'ellipse', 'polyline'];
    //         if (!graphicTagNames.includes(target.tagName.toLowerCase())) return;

    //         setSelectedElement(target);
    //         setIsModalOpen(true);
    //     };

    // const handleMouseOver = (e: MouseEvent) => {
    //     console.log('ok')
    //     const target = e.target as SVGElement;
    //     if (target instanceof SVGElement) {
    //         const graphicTagNames = ['path', 'rect', 'polygon', 'circle', 'ellipse', 'polyline'];
    //         if (!graphicTagNames.includes(target.tagName.toLowerCase())) return;

    //         const unitId = target.getAttribute("data-unit-id");
    //         const refId = target.getAttribute("data-ref-id") || target.getAttribute("id");
    //         const id = unitId || refId || "Area";

    //         target.classList.add("hovered");
    //         let name = id;
    //         if (unitId) {
    //             const unit = unitMap.get(unitId);
    //             if (unit) {
    //                 name = `${unit.name} (${unit.blockNumber})`;
    //             }
    //         }
    //         setHoveredInfo({ id, name });
    //     }
    // };

    // const handleMouseOut = (e: MouseEvent) => {
    //     const target = e.target as SVGElement;
    //     if (target instanceof SVGElement) {
    //         target.classList.remove("hovered");
    //         if (!wrapper.querySelector('.hovered')) {
    //             setHoveredInfo(null);
    //         }
    //     }
    // };

    // wrapper.addEventListener("click", handleClick);
    // wrapper.addEventListener("mouseover", handleMouseOver);
    // wrapper.addEventListener("mouseout", handleMouseOut);

    // return () => {
    //     wrapper.removeEventListener("click", handleClick);
    //     wrapper.removeEventListener("mouseover", handleMouseOver);
    //     wrapper.removeEventListener("mouseout", handleMouseOut);
    // };
    // }, [svgContent, unitMap, wrapperRef]);

    useEffect(() => {

        const wrapper = wrapperRef.current
        if (!wrapper) {
            return
        }


        const handleClick = (e: MouseEvent) => {
            const target = e.target as SVGElement

            setSelectedElement(target)
            setIsModalOpen(true);
        }

        const handleMouseOver = (e: MouseEvent) => {
            console.log("oke")
            const target = e.target as SVGElement;
            if (target instanceof SVGElement) {
                const graphicTagNames = ['path', 'rect', 'polygon', 'circle', 'ellipse', 'polyline'];
                if (!graphicTagNames.includes(target.tagName.toLowerCase())) return;

                const unitId = target.getAttribute("data-unit-id");
                const id = unitId || "Unassigned Unit";

                target.classList.add("hovered");
                let name = id;
                if (unitId) {
                    const unit = unitMap.get(unitId);
                    if (unit) {
                        name = `${unit.name} (${unit.blockNumber})`;
                    }
                }
                setHoveredInfo({ id, name });
            }
        };

        // const handleMouseOut = (e: MouseEvent) => {
        //     const target = e.target as SVGElement;
        //     if (target instanceof SVGElement) {
        //         target.classList.remove("hovered");
        //         if (!wrapper.querySelector('.hovered')) {
        //             setHoveredInfo(null);
        //         }
        //     }
        // };

        wrapper.addEventListener("click", handleClick);
        wrapper.querySelector("polygon")?.addEventListener("mouseover", handleMouseOver);

        return () => {
            wrapper.removeEventListener("click", handleClick);
            wrapper.querySelector("polygon")?.removeEventListener("mouseover", handleMouseOver);
        };
    }, [svgContent])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "image/svg+xml") {
            alert(t("onlySvg"));
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("siteplan", file);

        const result = await updateProjectSiteplan(projectId.toString(), formData);
        setIsUploading(false);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.error || "Upload failed");
        }
    };

    const handleAssignUnit = async () => {
        if (!selectedElement || !wrapperRef.current) return;

        const element = wrapperRef.current.querySelector(`[points="${selectedElement.getAttribute("points")}"]`)

        if (pendingUnitId === "none") {
            element?.removeAttribute("data-unit-id");
        } else {
            element?.setAttribute("data-unit-id", pendingUnitId);
        }

        const svg = wrapperRef.current.querySelector("svg");

        if (!svg) return;

        setIsModalOpen(false);
        setIsUploading(true);

        try {
            const svgString = new XMLSerializer().serializeToString(svg);
            setSvgContent(svgString);

            const blob = new Blob([svgString], { type: "image/svg+xml" });
            const file = new File([blob], "siteplan.svg", { type: "image/svg+xml" });

            const formData = new FormData();
            formData.append("siteplan", file);

            const result = await updateProjectSiteplan(projectId.toString(), formData);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error || "Save failed");
            }
        } catch (error) {
            console.error("Error saving SVG:", error);
            alert("Error saving SVG");
        } finally {
            setIsUploading(false);
            setSelectedElement(null);
        }
    };

    return (
        <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Layout className="size-5 text-primary" />
                        {t("siteplan")}
                    </CardTitle>
                    <CardDescription>
                        {hoveredInfo ? (
                            <span className="text-primary font-medium flex items-center gap-1.5">
                                <Info className="size-3.5" />
                                {hoveredInfo.name || hoveredInfo.id}
                            </span>
                        ) : (
                            t("siteplanSubtitle")
                        )}
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <input
                        type="file"
                        accept=".svg"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleUpload}
                    />
                    <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {isUploading ? (
                            <Upload className="size-4 animate-bounce" />
                        ) : (
                            <FileType className="size-4" />
                        )}
                        {siteplan ? t("changeSiteplan") : t("uploadSiteplan")}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div
                    className={cn(
                        "rounded-lg border bg-muted/30 min-h-[500px] flex items-center justify-center relative group overflow-hidden transition-all duration-300",
                        hoveredInfo && "ring-1 ring-primary/20 bg-muted/50"
                    )}
                >
                    {svgContent ? (
                        <div
                            ref={wrapperRef}
                            className="w-full h-full p-4 flex items-center justify-center interactive-svg-wrapper"
                            dangerouslySetInnerHTML={{ __html: svgContent }}
                        />
                    ) : isLoadingSvg ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm font-medium animate-pulse">Rendering Siteplan...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-muted-foreground p-8 text-center">
                            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                                <Layout className="size-8 opacity-20" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium">{t("noSiteplan")}</p>
                                <p className="text-xs">{t("onlySvg")}</p>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="mt-2"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {t("uploadSiteplan")}
                            </Button>
                        </div>
                    )}

                    {isUploading && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm font-medium animate-pulse">{t("uploading")}</p>
                            </div>
                        </div>
                    )}
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t("assignUnit")}</DialogTitle>
                            <DialogDescription>
                                {t("assignUnitSubtitle")}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Select value={pendingUnitId} onValueChange={setPendingUnitId}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("selectUnit")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t("noUnitAssigned")}</SelectItem>
                                    {units.map((unit) => (
                                        <SelectItem key={unit.id} value={unit.id.toString()}>
                                            {unit.name} ({unit.blockNumber}) - {unit.unitType}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                {t("cancel")}
                            </Button>
                            <Button onClick={handleAssignUnit}>
                                <CheckCheck className="size-4 mr-2" />
                                {t("confirmAssignment")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <style jsx global>{`
                    .interactive-svg-wrapper svg {
                        width: 100%;
                        height: auto;
                        max-height: 80vh;
                        display: block;
                        filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
                    }
                    
                    .interactive-svg-wrapper path,
                    .interactive-svg-wrapper rect,
                    .interactive-svg-wrapper polygon,
                    .interactive-svg-wrapper circle,
                    .interactive-svg-wrapper ellipse,
                    .interactive-svg-wrapper polyline {
                        transition: all 0.2s ease;
                        pointer-events: all;
                    }

                    .interactive-svg-wrapper path:hover,
                    .interactive-svg-wrapper rect:hover,
                    .interactive-svg-wrapper polygon:hover,
                    .interactive-svg-wrapper circle:hover,
                    .interactive-svg-wrapper ellipse:hover,
                    .interactive-svg-wrapper polyline:hover {
                        cursor: pointer;
                        filter: brightness(1.1);
                        stroke: hsl(var(--primary));
                        stroke-width: 2px;
                    }

                    .interactive-svg-wrapper [data-unit-id] {
                        fill: hsl(var(--primary)) !important;
                        fill-opacity: 0.4;
                        stroke: hsl(var(--primary));
                        stroke-width: 1px;
                    }

                    .interactive-svg-wrapper .hovered {
                        filter: brightness(1.2) saturate(1.2);
                        stroke: hsl(var(--primary)) !important;
                        stroke-width: 3px !important;
                        fill-opacity: 0.8 !important;
                    }

                    .siteplan-image {
                        pointer-events: none;
                    }
                `}</style>
            </CardContent>
        </Card>
    );
}
