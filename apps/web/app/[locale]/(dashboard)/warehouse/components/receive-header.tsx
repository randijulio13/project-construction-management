import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";

export function ReceiveHeader() {
    return (
        <PageHeader
            title="Material Receiving Verification"
            subtitle={
                <p>
                    <span className="font-semibold text-foreground">
                        PO Ref: PO-2023-0892
                    </span>{" "}
                    | Supplier: <span className="underline decoration-muted-foreground underline-offset-4">PT. Global Semen Indonesia</span>{" "}
                    | Site:{" "}
                    <span className="font-medium text-foreground">
                        Grand Orion Heights
                    </span>
                </p>
            }
            action={
                <>
                    <Button variant="outline" className="font-bold">
                        Save Draft
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
                        <CheckCircle2 className="size-4" />
                        Update Stock
                    </Button>
                </>
            }
        />
    );
}
