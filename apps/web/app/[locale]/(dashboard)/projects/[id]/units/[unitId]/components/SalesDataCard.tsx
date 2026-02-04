'use client'

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { User, Phone, Mail, Calendar, DollarSign, Briefcase, FileText, Download, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadSalesDocumentForm } from "./UploadSalesDocumentForm";

interface SalesDataCardProps {
    salesOrder: any;
}

export function SalesDataCard({ salesOrder }: SalesDataCardProps) {
    const t = useTranslations("projects");

    if (!salesOrder) return null;

    const { customer, bookingDate, totalPrice, status, sales, documents } = salesOrder;

    return (
        <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="size-5 text-primary" />
                        {t("salesData")}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <UploadSalesDocumentForm salesOrderId={salesOrder.id} />
                        <Badge variant={status === "COMPLETED" ? "default" : "secondary"}>
                            {status}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {/* Buyer Info */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <User className="size-3" />
                        {t("buyerData")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground">{t("customerName")}</p>
                            <p className="text-sm font-semibold">{customer?.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground">{t("identityNumber")}</p>
                            <p className="text-sm font-semibold">{customer?.identityNumber}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground">{t("customerPhone")}</p>
                            <div className="flex items-center gap-2">
                                <Phone className="size-3 text-primary" />
                                <p className="text-sm font-semibold">{customer?.phone}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground">Email</p>
                            <div className="flex items-center gap-2">
                                <Mail className="size-3 text-primary" />
                                <p className="text-sm font-semibold">{customer?.email || "-"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1 pt-2">
                        <p className="text-[10px] text-muted-foreground">{t("customerAddress")}</p>
                        <div className="flex gap-2">
                            <MapPin className="size-3 text-primary shrink-0 mt-0.5" />
                            <p className="text-sm">{customer?.address || "-"}</p>
                        </div>
                    </div>
                </div>

                <hr className="border-dashed" />

                {/* Transaction Info */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <FileText className="size-3" />
                        Informasi Transaksi
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground">{t("bookingDate")}</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="size-3 text-primary" />
                                <p className="text-sm font-semibold">
                                    {bookingDate ? format(new Date(bookingDate), "dd MMM yyyy") : "-"}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground">{t("salesAgent")}</p>
                            <div className="flex items-center gap-2">
                                <Briefcase className="size-3 text-primary" />
                                <p className="text-sm font-semibold">{sales?.name || "-"}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground">{t("totalPrice")}</p>
                            <p className="text-sm font-bold text-primary">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalPrice)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Documents Section (Placeholder for now) */}
                {documents && documents.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("documents")}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {documents.map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg border bg-muted/30 group">
                                    <div className="flex items-center gap-2">
                                        <FileText className="size-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium">{t(`doc_${doc.type}`)}</span>
                                            <span className="text-[8px] text-muted-foreground">{format(new Date(doc.createdAt), "dd/MM/yy HH:mm")}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="size-3" />
                                        </a>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
