import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card shadow-sm border-border">
                <CardContent className="p-5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        Total Items ordered
                    </p>
                    <p className="text-2xl font-black">
                        12,400 <span className="text-sm font-medium text-muted-foreground">Units</span>
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-card shadow-sm border-border">
                <CardContent className="p-5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        Matching Status
                    </p>
                    <div className="flex items-center gap-3">
                        <p className="text-2xl font-black text-emerald-500">85%</p>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: "85%" }}></div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card shadow-sm border-border">
                <CardContent className="p-5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        QC Discrepancies
                    </p>
                    <p className="text-2xl font-black text-orange-500">
                        4 <span className="text-sm font-medium text-muted-foreground">Items</span>
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-card shadow-sm border-border">
                <CardContent className="p-5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        Arrival Window
                    </p>
                    <div className="flex items-center gap-2 text-primary">
                        <Clock className="size-5" />
                        <p className="text-sm font-bold text-foreground">On Time Delivery</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
