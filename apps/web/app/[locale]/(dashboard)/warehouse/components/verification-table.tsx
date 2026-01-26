import { Camera, AlertCircle, CheckCircle2, Hourglass, Image as ImageIcon, Filter, FileDown, UploadCloud } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const data = [
    {
        sku: "MAT-CEM-001",
        name: "Portland Cement PCC (50kg)",
        ordered: "1,000",
        prev: "400",
        incoming: "600",
        uom: "BAGS",
        status: "PASSED"
    },
    {
        sku: "MAT-STL-D13",
        name: "Reinforcement Bar D13",
        ordered: "500",
        prev: "0",
        incoming: "480",
        uom: "PCS",
        status: "PARTIAL"
    },
    {
        sku: "MAT-CON-K350",
        name: "Ready-Mix Concrete K-350",
        ordered: "24",
        prev: "8",
        incoming: "0",
        uom: "M3",
        status: "PENDING"
    },
    {
        sku: "MAT-SND-FIN",
        name: "Fine Sand (Labanan)",
        ordered: "12",
        prev: "0",
        incoming: "12",
        uom: "TRUCK",
        status: "REJECTED",
        critical: true
    }
];

export function VerificationTable() {
    return (
        <Card className="bg-card border-border overflow-hidden shadow-sm mb-20">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
                <h3 className="font-bold text-lg">PO Line Items Verification</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1">
                        <Filter className="size-3" /> Filter
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1">
                        <FileDown className="size-3" /> Export
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="px-6 py-4 text-muted-foreground text-xs font-bold uppercase">Item Details</TableHead>
                            <TableHead className="px-6 py-4 text-muted-foreground text-xs font-bold uppercase">Ordered</TableHead>
                            <TableHead className="px-6 py-4 text-muted-foreground text-xs font-bold uppercase">Prev. Received</TableHead>
                            <TableHead className="px-6 py-4 text-muted-foreground text-xs font-bold uppercase">Incoming (Now)</TableHead>
                            <TableHead className="px-6 py-4 text-muted-foreground text-xs font-bold uppercase">UoM</TableHead>
                            <TableHead className="px-6 py-4 text-muted-foreground text-xs font-bold uppercase">QC Status</TableHead>
                            <TableHead className="px-6 py-4 text-muted-foreground text-xs font-bold uppercase text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow
                                key={item.sku}
                                className={item.critical ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-accent/50 transition-colors"}
                            >
                                <TableCell className="px-6 py-4">
                                    <div className="font-bold text-sm">{item.name}</div>
                                    <div className="text-[10px] text-muted-foreground font-mono">SKU: {item.sku}</div>
                                </TableCell>
                                <TableCell className="px-6 py-4 font-medium">{item.ordered}</TableCell>
                                <TableCell className="px-6 py-4 text-muted-foreground">{item.prev}</TableCell>
                                <TableCell className="px-6 py-4">
                                    <Input
                                        className="w-24 h-9 bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary font-bold text-sm"
                                        defaultValue={item.incoming}
                                    />
                                </TableCell>
                                <TableCell className="px-6 py-4 text-xs font-semibold">{item.uom}</TableCell>
                                <TableCell className="px-6 py-4">
                                    <StatusBadge status={item.status} />
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                    <button className="text-muted-foreground hover:text-primary transition-colors">
                                        {item.status === 'REJECTED' ? (
                                            <div className="relative inline-block">
                                                <ImageIcon className="size-4 text-primary" />
                                                <span className="absolute -top-1.5 -right-1.5 size-3.5 bg-destructive rounded-full border border-background text-[8px] flex items-center justify-center text-white font-bold">2</span>
                                            </div>
                                        ) : (
                                            <Camera className="size-4" />
                                        )}
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="p-6 bg-muted/50 border-t border-border">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold mb-2">
                            Internal Notes & Remarks
                        </label>
                        <Textarea
                            className="bg-background border-border text-sm focus-visible:ring-1 focus-visible:ring-primary min-h-[80px]"
                            placeholder="Enter discrepancy details or receiving notes..."
                        />
                    </div>
                    <div className="flex flex-col justify-between">
                        <label className="block text-sm font-bold mb-2">
                            Delivery Documentation
                        </label>
                        <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-accent/50 transition-colors cursor-pointer group">
                            <UploadCloud className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            <p className="text-xs text-muted-foreground font-medium">
                                Drag & drop delivery note photos or click to upload
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "PASSED":
            return (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-none px-2.5 py-1 text-[10px] font-bold gap-1">
                    <CheckCircle2 className="size-3" /> PASSED
                </Badge>
            );
        case "PARTIAL":
            return (
                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-none px-2.5 py-1 text-[10px] font-bold gap-1">
                    <AlertCircle className="size-3" /> PARTIAL
                </Badge>
            );
        case "PENDING":
            return (
                <Badge variant="outline" className="bg-muted text-muted-foreground border-none px-2.5 py-1 text-[10px] font-bold gap-1">
                    <Hourglass className="size-3" /> PENDING
                </Badge>
            );
        case "REJECTED":
            return (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-none px-2.5 py-1 text-[10px] font-bold gap-1">
                    <AlertCircle className="size-3" /> REJECTED
                </Badge>
            );
        default:
            return null;
    }
}
