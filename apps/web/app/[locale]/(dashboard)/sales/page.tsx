import { getTranslations } from "next-intl/server";
import { DollarSign, User, Calendar, Home } from "lucide-react";
import { format } from "date-fns";

import { getSalesOrders } from "@/app/actions/sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function SalesPage() {
    const t = await getTranslations("projects");
    const salesOrders = await getSalesOrders();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
                    <p className="text-muted-foreground">
                        Kelola dan pantau semua transaksi unit properti.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{salesOrders.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Pesanan aktif & selesai
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unit Terbooking</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {salesOrders.filter(o => o.status === "CONFIRMED").length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Status Terkonfirmasi
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Transaksi</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No. Pesanan</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Pembeli</TableHead>
                                <TableHead>Total Harga</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salesOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        Belum ada data transaksi.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                salesOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>
                                            {format(new Date(order.bookingDate), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Home className="size-4 text-muted-foreground" />
                                                <span>Unit ID: {order.unitId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="size-4 text-muted-foreground" />
                                                <span>{order.customer?.name || "Unknown"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.totalPrice)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={order.status === "COMPLETED" ? "default" : "secondary"}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
