import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { PageHeader } from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";

export default function DashboardPage() {
    return (
        <PageWrapper>
            <PageHeader
                title="Dashboard"
            />

            <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Welcome to your dashboard!
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        This is a protected page. Only authenticated users can see this.
                    </p>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        <Card className="bg-background border-border">
                            <CardContent className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                    Active Projects
                                </h3>
                                <p className="text-4xl font-bold text-primary">12</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-background border-border">
                            <CardContent className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                    Pending Tasks
                                </h3>
                                <p className="text-4xl font-bold text-orange-500">5</p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
