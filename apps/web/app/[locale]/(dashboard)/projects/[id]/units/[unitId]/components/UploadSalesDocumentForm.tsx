'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { addSalesDocument } from "@/app/actions/sales";
import { cn } from "@/lib/utils";

interface UploadSalesDocumentFormProps {
    salesOrderId: number;
}

export function UploadSalesDocumentForm({ salesOrderId }: UploadSalesDocumentFormProps) {
    const t = useTranslations("projects");
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !type) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        const result = await addSalesDocument(salesOrderId.toString(), formData);
        setIsSubmitting(false);

        if (result.success) {
            setOpen(false);
            setFile(null);
            setType("");
            router.refresh();
        } else {
            alert(result.error || "Failed to upload document");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="size-4" />
                    {t("uploadDocument")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("uploadDocument")}</DialogTitle>
                    <DialogDescription>
                        Unggah dokumen pendukung untuk transaksi ini.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t("documentType")}</label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis Dokumen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="KTP">{t("doc_KTP")}</SelectItem>
                                <SelectItem value="NPWP">{t("doc_NPWP")}</SelectItem>
                                <SelectItem value="SPR">{t("doc_SPR")}</SelectItem>
                                <SelectItem value="PAYMENT_PROOF">{t("doc_PAYMENT_PROOF")}</SelectItem>
                                <SelectItem value="OTHER">{t("doc_OTHER")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t("selectFile")}</label>
                        <div className={cn(
                            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 transition-colors",
                            file ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
                        )}>
                            <Input
                                type="file"
                                className="hidden"
                                id="sales-doc-upload"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <label
                                htmlFor="sales-doc-upload"
                                className="cursor-pointer flex flex-col items-center gap-2"
                            >
                                {file ? (
                                    <>
                                        <CheckCircle2 className="size-8 text-primary" />
                                        <span className="text-xs font-medium text-center">{file.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <FileText className="size-8 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Klik untuk memilih file</span>
                                    </>
                                )}
                            </label>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic text-center">
                            Maksimal 5MB. Format: PDF, JPG, PNG.
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            {t("cancel")}
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !file || !type}>
                            {isSubmitting ? "..." : t("save")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
