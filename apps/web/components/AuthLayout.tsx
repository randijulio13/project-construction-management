"use client";

import { AuthHero } from "./AuthHero";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex w-full h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
            <AuthHero />

            {/* Right Side: Form Container */}
            <div className="w-full lg:w-2/5 flex flex-col bg-card shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-30 transition-colors duration-300 overflow-y-auto">
                <header className="p-8 flex justify-end">
                    <LanguageSwitcher />
                </header>

                <main className="flex-1 flex items-center justify-center px-8 sm:px-12 md:px-20 lg:px-16">
                    <div className="w-full max-w-[440px]">
                        {children}
                    </div>
                </main>

                <footer className="p-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-muted-foreground">
                    <div>© 2026 BluePrint Sistem Manajemen Konstruksi</div>
                    <div className="flex items-center gap-4">
                        <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
                        <span className="bg-muted px-2 py-1 rounded">v1.0.2-stable</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
