import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { BreadcrumbProvider } from "@/components/BreadcrumbProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <BreadcrumbProvider>
            <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
                <Sidebar className="hidden lg:flex" />
                <main className="flex-1 flex flex-col h-screen overflow-hidden">
                    <Header />
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {children}
                    </div>
                </main>
            </div>
        </BreadcrumbProvider>
    );
}
