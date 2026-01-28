import { useTranslations } from "next-intl";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground animate-pulse text-sm">Loading project details...</p>
        </div>
    );
}
