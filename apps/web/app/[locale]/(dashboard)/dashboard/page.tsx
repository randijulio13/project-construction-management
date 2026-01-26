import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default function DashboardPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <form action={logout}>
                    <Button variant="destructive" className="flex items-center gap-2">
                        <LogOut className="size-4" />
                        Logout
                    </Button>
                </form>
            </div>

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
        </div>
    );
}
