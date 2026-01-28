"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@construction/shared";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { login } from "@/app/actions/auth";
import { AlertCircleIcon, ArrowRightIcon, EyeIcon, EyeOffIcon, InfoIcon, LockIcon, MailIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const tAuth = useTranslations("auth.login");
    const tAssistance = useTranslations("auth.assistance");
    const tVal = useTranslations("validation");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("password", data.password);

            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            }
            if (result?.success) {
                router.push("/dashboard");
            }
        } catch (err) {
            console.log({ error: err })
            setError("Something went wrong");
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
                    <AlertCircleIcon className="size-5" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">{tAuth("emailLabel")}</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                            <span className="shrink-0"><MailIcon className="size-5" /></span>
                        </div>
                        <Input
                            {...register("email")}
                            type="email"
                            className={`pl-11 h-14 bg-muted/30 border-border rounded-lg placeholder:text-muted-foreground/60 ${errors.email ? 'border-destructive' : ''}`}
                            placeholder={tAuth("emailPlaceholder")}
                        />
                    </div>
                    {errors.email && <p className="text-xs text-destructive font-medium">{tVal(errors.email.message as string)}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">{tAuth("passwordLabel")}</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                            <span className="shrink-0"><LockIcon className="size-5" /></span>
                        </div>
                        <Input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            className={`pl-11 pr-12 h-14 bg-muted/30 border-border rounded-lg placeholder:text-muted-foreground/60 ${errors.password ? 'border-destructive' : ''}`}
                            placeholder={tAuth("passwordPlaceholder")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary transition-colors z-10"
                        >
                            {showPassword ? (
                                <EyeOffIcon className="size-5" />
                            ) : (
                                <EyeIcon className="size-5" />
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive font-medium">{tVal(errors.password.message as string)}</p>}
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
                    {!isLoading && <ArrowRightIcon className="size-5" />}
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
                <span className="shrink-0"><InfoIcon className="text-primary size-6" /></span>
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
