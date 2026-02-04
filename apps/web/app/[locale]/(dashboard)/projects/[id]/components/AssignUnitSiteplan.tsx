'use client'

import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Layout, CheckCheck, Info, ArrowLeft } from "lucide-react";
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

import { updateProject, getSiteplanSvg } from "@/app/actions/project";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProjectUnit } from "@construction/shared";
import Link from "next/link";
import { usePathname } from "@/i18n/routing";

interface AssignUnitSiteplanProps {
    projectId: number;
    siteplan: string | null;
    siteplanConfig: Record<string, number> | null;
    units: ProjectUnit[];
}

export function AssignUnitSiteplan({ projectId, siteplan, siteplanConfig, units }: AssignUnitSiteplanProps) {
    const t = useTranslations("projects");
    const router = useRouter();
    const pathname = usePathname();
    const backPath = pathname.replace("/assign-unit", "");

    const [isSaving, setIsSaving] = useState(false);
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [isLoadingSvg, setIsLoadingSvg] = useState(false);
    const [hoveredInfo, setHoveredInfo] = useState<{ id: string, name?: string } | null>(null);

    // Modal state
    const [selectedSelector, setSelectedSelector] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingUnitId, setPendingUnitId] = useState<string>("");

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Memoize unit map for quick lookup
    const unitMap = useMemo(() => {
        const map = new Map<string, ProjectUnit>();
        units.forEach(u => map.set(u.id.toString(), u));
        return map;
    }, [units]);

    // Reverse map to find unit by selector (from project config)
    const selectorToUnitMap = useMemo(() => {
        const map = new Map<string, ProjectUnit>();
        if (siteplanConfig) {
            Object.entries(siteplanConfig).forEach(([selector, unitId]) => {
                const unit = unitMap.get(unitId.toString());
                if (unit) {
                    map.set(selector, unit);
                }
            });
        }
        return map;
    }, [siteplanConfig, unitMap]);

    // Fetch SVG content to render inline
    useEffect(() => {
        if (!siteplan) {
            setSvgContent(null);
            return;
        }

        const fetchSvg = async () => {
            setIsLoadingSvg(true);
            try {
                const text = await getSiteplanSvg(`${siteplan}?t=${Date.now()}`);

                if (text && text.includes("<svg")) {
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

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper || !svgContent) return;

        // Clean up and inject
        wrapper.innerHTML = "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, "image/svg+xml");
        const svg = doc.querySelector("svg");

        if (!svg) {
            wrapper.innerHTML = svgContent;
            return;
        }

        // Apply metadata mappings from siteplanConfig
        if (siteplanConfig) {
            Object.entries(siteplanConfig).forEach(([selector, unitId]) => {
                const [tagName, indexStr] = selector.split(":");
                const elements = svg.querySelectorAll(tagName);
                const target = elements[parseInt(indexStr)] as SVGElement;
                if (target) {
                    target.setAttribute("data-unit-id", unitId.toString());
                    target.classList.add("mapped-unit");
                }
            });
        }

        wrapper.appendChild(svg);

        const handleClick = (e: MouseEvent) => {
            let target = e.target as SVGElement;
            const graphicTagNames = ['path', 'rect', 'polygon', 'circle', 'ellipse', 'polyline'];
            const tagName = target.tagName.toLowerCase();
            if (!graphicTagNames.includes(tagName)) return;

            // Calculate selector: tag:index
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
            const existingUnit = selectorToUnitMap.get(selector);

            setPendingUnitId(existingUnit ? existingUnit.id.toString() : "none");
            setSelectedSelector(selector);
            setIsModalOpen(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as SVGElement;
            if (target instanceof SVGElement) {
                const graphicTagNames = ['path', 'rect', 'polygon', 'circle', 'ellipse', 'polyline'];
                if (!graphicTagNames.includes(target.tagName.toLowerCase())) return;

                const unitId = target.getAttribute("data-unit-id");
                const id = unitId || "Area";

                target.classList.add("hovered");
                let name = id;
                if (unitId) {
                    const unit = unitMap.get(unitId);
                    if (unit) {
                        name = unit.blockNumber;
                    }
                } else if (id === "Area" || !id) {
                    name = t("noUnitAssigned");
                }
                setHoveredInfo({ id, name });
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as SVGElement;
            if (target instanceof SVGElement) {
                target.classList.remove("hovered");
                setHoveredInfo(null);
            }
        };

        wrapper.addEventListener("click", handleClick);
        wrapper.addEventListener("mouseover", handleMouseOver);
        wrapper.addEventListener("mouseout", handleMouseOut);

        return () => {
            wrapper.removeEventListener("click", handleClick);
            wrapper.removeEventListener("mouseover", handleMouseOver);
            wrapper.removeEventListener("mouseout", handleMouseOut);
        };
    }, [svgContent, unitMap, t, units, selectorToUnitMap, siteplanConfig]);

    const handleAssignUnit = async () => {
        if (!selectedSelector) return;

        setIsSaving(true);
        setIsModalOpen(false);

        try {
            const newConfig = { ...(siteplanConfig || {}) };

            // Remove unit from any existing selector if it's already assigned somewhere
            if (pendingUnitId !== "none") {
                Object.keys(newConfig).forEach(key => {
                    if (newConfig[key] === parseInt(pendingUnitId)) {
                        delete newConfig[key];
                    }
                });
                newConfig[selectedSelector] = parseInt(pendingUnitId);
            } else {
                delete newConfig[selectedSelector];
            }

            await updateProject(projectId.toString(), {
                siteplanConfig: newConfig
            });

            router.refresh();
        } catch (error) {
            console.error("Error saving mapping:", error);
            alert("Error saving mapping");
        } finally {
            setIsSaving(false);
            setSelectedSelector(null);
        }
    };

    return (
        <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-4">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Layout className="size-5 text-primary" />
                            {t("manageAssignments")}
                        </CardTitle>
                        <CardDescription>
                            {hoveredInfo ? (
                                <span className="text-primary font-medium flex items-center gap-1.5">
                                    <Info className="size-3.5" />
                                    {hoveredInfo.name || hoveredInfo.id}
                                </span>
                            ) : (
                                t("assignUnitSubtitle")
                            )}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div
                    className={cn(
                        "rounded-lg border bg-muted/30 flex items-center justify-center relative group overflow-hidden transition-all duration-300",
                        hoveredInfo && "ring-1 ring-primary/20 bg-muted/50"
                    )}
                >
                    {svgContent ? (
                        <div
                            ref={wrapperRef}
                            className="w-full h-full flex items-center justify-center interactive-svg-wrapper"
                        />
                    ) : isLoadingSvg ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm font-medium animate-pulse">Rendering Siteplan...</p>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            {t("noSiteplan")}
                        </div>
                    )}

                    {isSaving && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm font-medium animate-pulse">{t("saving")}</p>
                            </div>
                        </div>
                    )}
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="w-[400px]">
                        <DialogHeader>
                            <DialogTitle>{t("assignUnit")}</DialogTitle>
                            <DialogDescription>
                                {t("assignUnitSubtitle")}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Select value={pendingUnitId} onValueChange={setPendingUnitId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t("selectUnit")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t("noUnitAssigned")}</SelectItem>
                                    {units.map((unit) => (
                                        <SelectItem key={unit.id} value={unit.id.toString()}>
                                            {unit.blockNumber} [ Tipe {unit.unitType} ]
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                {t("cancel")}
                            </Button>
                            <Button onClick={handleAssignUnit} disabled={isSaving}>
                                <CheckCheck className="size-4 mr-2" />
                                {t("confirmAssignment")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


            </CardContent>
        </Card>
    );
}
