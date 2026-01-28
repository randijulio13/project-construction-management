"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Layout, Upload, FileType, ZoomIn, ZoomOut, Maximize } from "lucide-react";
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

interface DigitalSiteplanProps {
    projectId: number;
    siteplan: string | null;
}

export function DigitalSiteplan({ projectId, siteplan }: DigitalSiteplanProps) {
    const t = useTranslations("projects");
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [isLoadingSvg, setIsLoadingSvg] = useState(false);
    const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

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
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper || !svgContent) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as SVGElement;
            if (target instanceof SVGElement) {
                const id = target.getAttribute("data-ref-id");

                if (id) {
                    const identifier = id;
                    console.log("CLICK:", identifier);
                    alert(`Clicked: ${identifier}`);
                }
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as SVGElement;
            if (target instanceof SVGElement) {
                const id = target.getAttribute("data-ref-id");

                if (id) {
                    target.classList.add("hovered");
                    setHoveredInfo(id);
                }
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as SVGElement;
            if (target instanceof SVGElement) {
                target.classList.remove("hovered");
                if (!wrapper.querySelector('.hovered')) {
                    setHoveredInfo(null);
                }
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
    }, [svgContent]);

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
                            <span className="text-primary font-medium">Focusing: {hoveredInfo}</span>
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

                <style jsx global>{`
                    .interactive-svg-wrapper svg {
                        width: 100%;
                        height: auto;
                        max-height: 80vh;
                        display: block;
                        filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
                    }
                    
                    /* Target elements for interactivity */
                    .interactive-svg-wrapper path,
                    .interactive-svg-wrapper rect,
                    .interactive-svg-wrapper polygon,
                    .interactive-svg-wrapper circle {
                        transition: all 0.2s ease;
                    }

                    .interactive-svg-wrapper .hovered {
                        cursor: pointer;
                        filter: brightness(1.2) saturate(1.2);
                        stroke: hsl(var(--primary)) !important;
                        stroke-width: 3px !important;
                        fill-opacity: 0.8;
                    }

                    .siteplan-image {
                        pointer-events: none;
                    }
                `}</style>
            </CardContent>
        </Card>
    );
}
