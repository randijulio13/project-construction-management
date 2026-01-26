import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function FooterActions() {
    return (
        <footer className="fixed bottom-0 right-0 left-64 h-20 bg-card border-t border-border px-8 flex items-center justify-between shrink-0 z-10">
            <div className="flex gap-8">
                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                        Items to Receive
                    </p>
                    <p className="text-xl font-black">1,092</p>
                </div>
                <div className="h-10 w-px bg-border"></div>
                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                        Discrepancy Count
                    </p>
                    <p className="text-xl font-black text-orange-500">2 Line Items</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right mr-4">
                    <p className="text-[10px] font-bold text-muted-foreground">
                        Warehouse Bin Assignment
                    </p>
                    <Select defaultValue="wh-a">
                        <SelectTrigger className="border-none bg-transparent p-0 h-auto font-bold text-sm shadow-none focus:ring-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="wh-a">WH-A / Section 4-B (Default)</SelectItem>
                            <SelectItem value="wh-b">WH-B / Hazardous Area</SelectItem>
                            <SelectItem value="wh-c">WH-C / Cold Storage</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="px-8 py-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-base">
                    Confirm & Update Stock
                </Button>
            </div>
        </footer>
    );
}
