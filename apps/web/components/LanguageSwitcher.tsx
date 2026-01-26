"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
    const locale = useLocale();
    const t = useTranslations("profile"); // Reusing profile.language key
    const router = useRouter();
    const pathname = usePathname();

    const locales = [
        { code: "en", name: "English (US)" },
        { code: "id", name: "Indonesia" },
    ];

    const handleLocaleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale as "en" | "id" });
    };

    const currentLanguage = locales.find((l) => l.code === locale)?.name || "Language";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors focus-visible:ring-primary/20">
                    <Languages className="size-[18px]" />
                    {currentLanguage}
                    <ChevronDown className="size-[18px]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
                {locales.map((l) => (
                    <DropdownMenuItem
                        key={l.code}
                        onClick={() => handleLocaleChange(l.code)}
                        className={cn(
                            "flex items-center justify-between cursor-pointer",
                            locale === l.code && "text-primary font-bold bg-primary/5"
                        )}
                    >
                        {l.name}
                        {locale === l.code && <Check className="size-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
