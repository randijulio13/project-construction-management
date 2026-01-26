"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Info, AlertCircle } from "lucide-react";

export function LoginForm() {
    const tAuth = useTranslations("auth.login");
    const tAssistance = useTranslations("auth.assistance");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const clientAction = async (formData: FormData) => {
        setIsLoading(true);
        setError("");
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <>
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
                {/* Email Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">{tAuth("emailLabel")}</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                            <span className="shrink-0"><Mail className="size-5" /></span>
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
                            <span className="shrink-0"><Lock className="size-5" /></span>
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

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-muted/30"
                        />
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{tAuth("rememberMe")}</span>
                    </label>
                    <a className="text-sm font-bold text-primary hover:underline underline-offset-4" href="#">{tAuth("forgotPassword")}</a>
                </div>

                {/* Action Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-lg font-bold text-base shadow-lg shadow-primary/20 transition-all gap-2"
                >
                    <span>{isLoading ? tAuth("authenticating") : tAuth("submit")}</span>
                    {!isLoading && <ArrowRight className="size-5" />}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
                {tAuth("noAccount")}{" "}
                <Link href="/register" className="font-bold text-primary hover:underline underline-offset-4">
                    {tAuth("registerNow")}
                </Link>
            </p>

            {/* Support/Help */}
            <div className="mt-10 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                <span className="shrink-0"><Info className="text-primary size-6" /></span>
                <div className="text-sm">
                    <p className="font-bold text-foreground">{tAssistance("title")}</p>
                    <p className="text-muted-foreground">
                        {tAssistance("contact", { email: "support@blueprint-smk.com" })}
                    </p>
                </div>
            </div>
        </>
    );
}
