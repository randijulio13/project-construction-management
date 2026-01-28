"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Lock,
    Moon,
    Sun, Camera,
    Edit2,
    Building2,
    Home,
    ChevronRight, Languages, LogOut
} from "lucide-react";
import { getProfile, updatePassword, logout } from "@/app/actions/auth";
import { UserSession, UpdatePasswordRequest } from "@construction/shared";
import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ProfilePage() {
    const t = useTranslations("profile");
    const commonT = useTranslations("common");
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();
    const { setTheme, resolvedTheme } = useTheme();

    const [user, setUser] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [passwordData, setPasswordData] = useState<UpdatePasswordRequest & { confirmPassword: string }>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [activeTab, setActiveTab] = useState("personal");

    const isDarkMode = useMemo(() => resolvedTheme === "dark", [resolvedTheme]);

    useEffect(() => {
        const fetchProfile = async () => {
            const result = await getProfile();
            if (result.data) {
                setUser(result.data);
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: t("password.confirm") + " must match" });
            return;
        }

        const formData = new FormData();
        formData.append("currentPassword", passwordData.currentPassword);
        formData.append("newPassword", passwordData.newPassword);
        formData.append("confirmPassword", passwordData.confirmPassword);

        const result = await updatePassword(formData);
        if (result.error) {
            setMessage({ type: "error", text: result.error });
        } else {
            setMessage({ type: "success", text: result.message || "Password updated successfully" });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        }
    };

    const toggleDarkMode = () => {
        setTheme(isDarkMode ? "light" : "dark");
    };

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };


    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    }

    return (
        <main className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-6 gap-6">

                {/* Left Column: Navigation Sidebar */}


                {/* Right Column: Profile Content */}
                <div className="flex flex-col gap-6">
                    {/* ProfileHeader */}
                    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex gap-6 items-center">
                                <div className="relative">
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-background shadow-md overflow-hidden">
                                        <Image
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVX-Qi8CLcSnqNXHLUcF700uj236HoXh3FNMnc6Na19ngvlhFzwKmoYPRVGVzwvKZ0cGjvHHxYcoBl930oRoQOM9gwUcHLRO-CsVuu3egcXOctn4zs8y_vzlOvZrNUftLe29DNzspWwFxKlLa9phmD0RRRjlfjOc_MOjtWfpxEjuWS8x1LapQmNHlJTMZiQQJs8593D0QZqhK2uirwRHToihk6Td-b3XZCVpTB3aTnAK_pncOJwWOSeHhCAn8uXkrFzy8I1KDqGLh6"
                                            alt="User Profile"
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                    </div>
                                    <button className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-background shadow-sm flex items-center justify-center">
                                        <Camera className="size-[18px]" />
                                    </button>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-foreground text-2xl font-bold leading-tight">{user?.firstName} {user?.lastName}</h1>
                                    <p className="text-muted-foreground text-base font-medium">Senior Project Manager</p>
                                    <p className="text-muted-foreground text-sm">Site Development Department • Employee ID: #BP-92011</p>
                                    <div className="flex mt-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">{t("status.active")}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <Button variant="outline" className="flex-1 md:flex-none flex items-center justify-center gap-2">
                                    <Edit2 className="size-5" />
                                    {t("edit")}
                                </Button>
                                <form action={handleLogout}>
                                    <Button variant="destructive" className="flex-1 md:flex-none flex items-center justify-center gap-2">
                                        <LogOut className="size-5" />
                                        {commonT("logout")}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Component */}
                    <div className="bg-card rounded-xl border border-border shadow-sm">
                        <div className="border-b border-border px-6 overflow-x-auto">
                            <div className="flex gap-8 whitespace-nowrap">
                                <button
                                    onClick={() => setActiveTab("personal")}
                                    className={cn(
                                        "flex flex-col items-center justify-center border-b-2 py-4",
                                        activeTab === "personal" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground transition-colors"
                                    )}
                                >
                                    <p className="text-sm font-bold tracking-[0.015em]">{t("tabs.personal")}</p>
                                </button>
                                <button
                                    onClick={() => setActiveTab("security")}
                                    className={cn(
                                        "flex flex-col items-center justify-center border-b-2 py-4",
                                        activeTab === "security" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground transition-colors"
                                    )}
                                >
                                    <p className="text-sm font-bold tracking-[0.015em]">{t("tabs.security")}</p>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {activeTab === "personal" && (
                                <div className="space-y-10">
                                    {/* Personal Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("fields.fullName")}</label>
                                            <p className="text-base font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("email")}</label>
                                            <p className="text-base font-medium text-foreground">{user?.email}</p>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("fields.phone")}</label>
                                            <p className="text-base font-medium text-foreground">+62 812-3456-7890</p>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("fields.birthDate")}</label>
                                            <p className="text-base font-medium text-foreground">14 August 1985</p>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("fields.nationality")}</label>
                                            <p className="text-base font-medium text-foreground">Indonesian</p>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("fields.homeOffice")}</label>
                                            <p className="text-base font-medium text-foreground">Jakarta Central HQ</p>
                                        </div>
                                    </div>

                                    {/* Assigned Projects */}
                                    <div className="pt-8 border-t border-border">
                                        <h3 className="text-lg font-bold mb-6">{t("assignedProjects")}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary transition-colors cursor-pointer group">
                                                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <Building2 className="size-6" />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <p className="text-sm font-bold text-foreground truncate">Grand Blueview Apartment</p>
                                                    <p className="text-xs text-muted-foreground">Structural Phase • Jakarta Selatan</p>
                                                </div>
                                                <ChevronRight className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary transition-colors cursor-pointer group">
                                                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <Home className="size-6" />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <p className="text-sm font-bold text-foreground truncate">Puri Indah Residence</p>
                                                    <p className="text-xs text-muted-foreground">Land Clearing • BSD City</p>
                                                </div>
                                                <ChevronRight className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preferences (Dark Mode & Language) */}
                                    <div className="pt-8 border-t border-border space-y-6">
                                        <h3 className="text-lg font-bold">{t("settings")}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                                <div className="flex gap-4">
                                                    <div className="text-primary mt-1">
                                                        {isDarkMode ? <Moon className="size-5" /> : <Sun className="size-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">{t("darkMode")}</p>
                                                        <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                                                    {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                                <div className="flex gap-4">
                                                    <div className="text-primary mt-1">
                                                        <Languages className="size-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">{t("language")}</p>
                                                        <p className="text-xs text-muted-foreground">Select your preferred language</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant={currentLocale === "id" ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handleLanguageChange("id")}
                                                    >
                                                        ID
                                                    </Button>
                                                    <Button
                                                        variant={currentLocale === "en" ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handleLanguageChange("en")}
                                                    >
                                                        EN
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="flex flex-col gap-6">
                                    {/* Password Form */}
                                    <div className="bg-muted/30 p-6 rounded-xl border border-border">
                                        <div className="flex gap-4 mb-6">
                                            <div className="text-primary">
                                                <Lock className="size-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">{t("password.title")}</h3>
                                                <p className="text-sm text-muted-foreground">Ensure your account is using a long, random password to stay secure.</p>
                                            </div>
                                        </div>
                                        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                                            <div className="space-y-2 flex flex-col">
                                                <label className="text-sm font-bold" htmlFor="currentPassword">{t("password.current")}</label>
                                                <Input
                                                    id="currentPassword"
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2 flex flex-col">
                                                <label className="text-sm font-bold" htmlFor="newPassword">{t("password.new")}</label>
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2 flex flex-col">
                                                <label className="text-sm font-bold" htmlFor="confirmPassword">{t("password.confirm")}</label>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            {message && (
                                                <div className={cn(
                                                    "p-3 rounded-md text-sm",
                                                    message.type === "success" ? "bg-primary/10 text-primary border border-primary/20" : "bg-destructive/10 text-destructive border border-destructive/20"
                                                )}>
                                                    {message.text}
                                                </div>
                                            )}

                                            <Button type="submit" className="w-full md:w-auto">
                                                {t("password.update")}
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
