'use client'

import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { format } from "date-fns";
import { CheckCircle2, Circle, Image as ImageIcon, MapPin } from "lucide-react";
import { ProjectUnitProgress } from "@construction/shared";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProgressTimelineProps {
    logs: ProjectUnitProgress[];
}

export function ProgressTimeline({ logs }: ProgressTimelineProps) {
    const t = useTranslations("projects");

    if (!logs || logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-xl border border-dashed">
                <Circle className="size-8 text-muted-foreground mb-3 opacity-20" />
                <p className="text-sm font-medium text-muted-foreground">{t("noHistory")}</p>
            </div>
        );
    }

    // Sort logs by date descending
    const sortedLogs = [...logs].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {sortedLogs.map((log, index) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon / Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        {log.percentage === 100 ? (
                            <CheckCircle2 className="size-5 text-primary fill-primary/10" />
                        ) : (
                            <div className="size-2.5 rounded-full bg-primary animate-pulse" />
                        )}
                    </div>

                    {/* Content Card */}
                    <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 border-none shadow-sm bg-card/60 backdrop-blur-sm group-hover:bg-card/80 transition-all">
                        <CardContent className="p-0 space-y-3">
                            <div className="flex items-center justify-between">
                                <time className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm")}
                                </time>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                                    {log.percentage}%
                                </span>
                            </div>

                            {log.notes && (
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    {log.notes}
                                </p>
                            )}

                            {log.photoUrl && (
                                <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted/50 group/image">
                                    <img
                                        src={`/api/proxy/image?path=${encodeURIComponent(log.photoUrl)}`}
                                        alt={`Progress ${log.percentage}%`}
                                        className="object-cover group-hover/image:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                                            <ImageIcon className="size-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
}
