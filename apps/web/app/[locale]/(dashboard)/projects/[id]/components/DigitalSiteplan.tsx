'use client'

import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Layout, Upload, FileType, Info, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { updateProjectSiteplan } from "@/app/actions/project";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProjectUnit } from "@construction/shared";
import Link from "next/link";
import { usePathname } from "@/i18n/routing";

interface DigitalSiteplanProps {
    projectId: number;
    siteplan: string | null;
    siteplanConfig: Record<string, number> | null;
    units: ProjectUnit[];
}

export function DigitalSiteplan({ projectId, siteplan, siteplanConfig, units }: DigitalSiteplanProps) {
    const t = useTranslations("projects");
    const router = useRouter();
    const pathname = usePathname();
    const [isUploading, setIsUploading] = useState(false);
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [isLoadingSvg, setIsLoadingSvg] = useState(false);
    const [hoveredInfo, setHoveredInfo] = useState<{ id: string, name?: string } | null>(null);
    const [showEditButton, setShowEditButton] = useState(false);

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

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper || !svgContent) return;

        // Clean up wrapper before re-injecting
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
                try {
                    const [tagName, indexStr] = selector.split(":");
                    const index = parseInt(indexStr);
                    const elements = svg.querySelectorAll(tagName);
                    const target = elements[index] as SVGElement;

                    if (target) {
                        target.setAttribute("data-unit-id", unitId.toString());
                        target.classList.add("mapped-unit");
                    }
                } catch (err) {
                    console.warn(`Failed to apply unit mapping for selector ${selector}:`, err);
                }
            });
        }

        wrapper.appendChild(svg);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as SVGElement;
            if (target instanceof SVGElement) {
                setShowEditButton(true);
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
            setShowEditButton(false);
        };

        wrapper.addEventListener("mouseover", handleMouseOver);
        wrapper.addEventListener("mouseout", handleMouseOut);

        return () => {
            wrapper.removeEventListener("mouseover", handleMouseOver);
            wrapper.removeEventListener("mouseout", handleMouseOut);
        };
    }, [svgContent, unitMap, t, units, siteplanConfig]);

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
                        "rounded-lg border bg-muted/30 flex items-center justify-center relative group overflow-hidden transition-all duration-300",
                        hoveredInfo && "ring-1 ring-primary/20 bg-muted/50"
                    )}
                >
                    {siteplan && (
                        <Button
                            size="sm"
                            variant="secondary"
                            className={cn("gap-2 absolute bottom-4 right-4 z-50 group-hover:opacity-100 opacity-0 duration-300")}
                            asChild
                        >
                            <Link href={`${pathname}/assign-unit`}>
                                <Edit3 className="size-4" />
                            </Link>
                        </Button>
                    )}
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
            </CardContent>
        </Card>
    );
}
