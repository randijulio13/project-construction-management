"use client";

import { useState } from "react";
import { register } from "@/app/actions/auth";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export function RegisterForm() {
    const tAuth = useTranslations("auth.register");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const clientAction = async (formData: FormData) => {
        setIsLoading(true);
        setError("");
        const result = await register(formData);
        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="py-12">
            <div className="mb-10">
                <h2 className="text-foreground text-3xl font-bold tracking-tight mb-2">{tAuth("title")}</h2>
                <p className="text-muted-foreground text-base">{tAuth("subtitle")}</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-center gap-3 font-medium">
                    <AlertCircle className="size-5" />
                    {error}
                </div>
            )}

            <form action={clientAction} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">{tAuth("firstNameLabel")}</label>
                        <Input
                            name="firstName"
                            type="text"
                            required
                            className="px-4 h-14 bg-muted/30 border-border rounded-lg placeholder:text-muted-foreground/60"
                            placeholder={tAuth("firstNamePlaceholder")}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">{tAuth("lastNameLabel")}</label>
                        <Input
                            name="lastName"
                            type="text"
                            required
                            className="px-4 h-14 bg-muted/30 border-border rounded-lg placeholder:text-muted-foreground/60"
                            placeholder={tAuth("lastNamePlaceholder")}
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">{tAuth("emailLabel")}</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                            <Mail className="size-5" />
                        </div>
                        <Input
                            name="email"
                            type="email"
                            required
                            className="pl-11 h-14 bg-muted/30 border-border rounded-lg placeholder:text-muted-foreground/60"
                            placeholder={tAuth("emailPlaceholder")}
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">{tAuth("passwordLabel")}</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                            <Lock className="size-5" />
                        </div>
                        <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="pl-11 pr-12 h-14 bg-muted/30 border-border rounded-lg placeholder:text-muted-foreground/60"
                            placeholder={tAuth("passwordPlaceholder")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary transition-colors z-10"
                        >
                            {showPassword ? (
                                <EyeOff className="size-5" />
                            ) : (
                                <Eye className="size-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Action Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-lg font-bold text-base shadow-lg shadow-primary/20 transition-all gap-2"
                >
                    <span>{isLoading ? tAuth("registering") : tAuth("submit")}</span>
                    {!isLoading && <ArrowRight className="size-5" />}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
                {tAuth("hasAccount")}{" "}
                <Link href="/login" className="font-bold text-primary hover:underline underline-offset-4">
                    {tAuth("loginHere")}
                </Link>
            </p>
        </div>
    );
}
