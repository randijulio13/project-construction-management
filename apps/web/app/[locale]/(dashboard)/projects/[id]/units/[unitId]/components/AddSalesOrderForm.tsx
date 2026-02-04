'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DollarSign, User, Phone, MapPin, Calendar, Briefcase, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createSalesOrderSchema, CreateSalesOrderInput } from "@construction/shared";
import { createSalesOrder } from "@/app/actions/sales";
import { getUsers } from "@/app/actions/user";
import { cn } from "@/lib/utils";

interface AddSalesOrderFormProps {
    unitId: number;
    unitPrice: number;
}

export function AddSalesOrderForm({ unitId, unitPrice }: AddSalesOrderFormProps) {
    const t = useTranslations("projects");
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [salesAgents, setSalesAgents] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<any>({ // Using any for ease with combined customerData
        resolver: zodResolver(createSalesOrderSchema),
        defaultValues: {
            unitId,
            totalPrice: unitPrice,
            bookingDate: new Date().toISOString().split('T')[0],
            status: "PENDING",
            customerData: {
                name: "",
                phone: "",
                email: "",
                identityNumber: "",
                address: ""
            }
        },
    });

    useEffect(() => {
        if (open) {
            const fetchUsers = async () => {
                const users = await getUsers();
                setSalesAgents(users);
            };
            fetchUsers();
        }
    }, [open]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        const result = await createSalesOrder(data);
        setIsSubmitting(false);

        if (result.success) {
            setOpen(false);
            reset();
            router.refresh();
        } else {
            alert(result.error || "Failed to create sales order");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full gap-2">
                    <DollarSign className="size-4" />
                    {t("processSales")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{t("processSales")}</DialogTitle>
                    <DialogDescription>
                        Isi formulir di bawah ini untuk memproses pemesanan unit ini.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <input type="hidden" {...register("unitId", { valueAsNumber: true })} />

                    {/* Customer Data Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-wider">
                            <User className="size-4" />
                            {t("buyerData")}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("customerName")}</label>
                                <Input
                                    {...register("customerData.name")}
                                    className={cn((errors.customerData as any)?.name && "border-destructive")}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("customerPhone")}</label>
                                <Input
                                    {...register("customerData.phone")}
                                    className={cn((errors.customerData as any)?.phone && "border-destructive")}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("identityNumber")}</label>
                                <Input
                                    {...register("customerData.identityNumber")}
                                    className={cn((errors.customerData as any)?.identityNumber && "border-destructive")}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email (Opsional)</label>
                                <Input
                                    {...register("customerData.email")}
                                    type="email"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("customerAddress")}</label>
                            <Textarea {...register("customerData.address")} />
                        </div>
                    </div>

                    <hr className="border-dashed" />

                    {/* Transaction Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-wider">
                            <FileText className="size-4" />
                            Data Transaksi
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("bookingDate")}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="date"
                                        className="pl-9"
                                        {...register("bookingDate")}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("salesAgent")}</label>
                                <Select onValueChange={(val) => setValue("salesId", parseInt(val))}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Pilih Sales Agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salesAgents.map((agent) => (
                                            <SelectItem key={agent.id} value={agent.id.toString()}>
                                                {agent.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("totalPrice")}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground font-bold">Rp</span>
                                <Input
                                    type="number"
                                    className="pl-9 font-bold text-primary"
                                    {...register("totalPrice", { valueAsNumber: true })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-2 border-t">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            {t("cancel")}
                        </Button>
                        <Button type="submit" className="px-8" disabled={isSubmitting}>
                            {isSubmitting ? "..." : t("save")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
