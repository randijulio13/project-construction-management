"use client";

import { useState } from "react";
import { register } from "@/app/actions/auth";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@construction/shared";
import { useRouter } from "next/navigation";

export function RegisterForm() {
    const tAuth = useTranslations("auth.register");
    const tVal = useTranslations("validation");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("email", data.email);
            formData.append("password", data.password);

            const result = await register(formData);
            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            }
            if (result?.success) {
                router.push("/login");
            }
        } catch (err) {
            setError("Something went wrong");
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">{tAuth("firstNameLabel")}</label>
                        <Input
                            {...registerField("firstName")}
                            type="text"
                            className={`px-4 h-14 bg-muted/30 border-border rounded-lg placeholder:text-muted-foreground/60 ${errors.firstName ? 'border-destructive' : ''}`}
                            placeholder={tAuth("firstNamePlaceholder")}
                        />
                        {errors.firstName && <p className="text-xs text-destructive font-medium">{tVal(errors.firstName.message as string)}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">{tAuth("lastNameLabel")}</label>
                        <Input
                            {...registerField("lastName")}
                            type="text"
                            className={`px-4 h-14 bg-muted/30 border-border rounded-lg placeholder:text-muted-foreground/60 ${errors.lastName ? 'border-destructive' : ''}`}
                            placeholder={tAuth("lastNamePlaceholder")}
                        />
                        {errors.lastName && <p className="text-xs text-destructive font-medium">{tVal(errors.lastName.message as string)}</p>}
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
                            {...registerField("email")}
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
                            <Lock className="size-5" />
                        </div>
                        <Input
                            {...registerField("password")}
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
                                <EyeOff className="size-5" />
                            ) : (
                                <Eye className="size-5" />
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive font-medium">{tVal(errors.password.message as string)}</p>}
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
