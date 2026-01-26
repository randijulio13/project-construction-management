import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReceiveHeader() {
    return (
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight">
                    Material Receiving Verification
                </h2>
                <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        PO Ref: PO-2023-0892
                    </span>{" "}
                    | Supplier: <span className="underline decoration-muted-foreground underline-offset-4">PT. Global Semen Indonesia</span>{" "}
                    | Site:{" "}
                    <span className="font-medium text-foreground">
                        Grand Orion Heights
                    </span>
                </p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" className="font-bold">
                    Save Draft
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
                    <CheckCircle2 className="size-4" />
                    Update Stock
                </Button>
            </div>
        </div>
    );
}
