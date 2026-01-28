"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye } from "lucide-react";
import { Project } from "@construction/shared";
import Image from "next/image";
import { API_URL } from "@/lib/constants";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";

interface ProjectDataTableProps {
    projects: Project[];
    isLoading: boolean;
}

export function ProjectDataTable({ projects, isLoading }: ProjectDataTableProps) {
    const t = useTranslations("projects");

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "default";
            case "completed":
                return "secondary";
            case "draft":
                return "outline";
            default:
                return "outline";
        }
    };

    const columns = useMemo<ColumnDef<Project>[]>(
        () => [
            {
                accessorKey: "logo",
                header: "Logo",
                cell: ({ row }) => {
                    const project = row.original;
                    return (
                        <div className="relative size-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
                            {project.logo ? (
                                <Image
                                    unoptimized={true}
                                    src={API_URL + project.logo}
                                    alt={project.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="text-muted-foreground text-[10px] font-bold uppercase">
                                    {project.name.substring(0, 2)}
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: "name",
                header: t("name"),
                cell: ({ row }) => {
                    const project = row.original;
                    return (
                        <div className="flex flex-col">
                            <span className="font-medium">{project.name}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="size-3" />
                                {project.address}
                            </span>
                        </div>
                    );
                },
            },
            {
                accessorKey: "status",
                header: t("status"),
                cell: ({ row }) => (
                    <Badge variant={getStatusVariant(row.getValue("status"))}>
                        {row.getValue("status")}
                    </Badge>
                ),
            },
            {
                id: "actions",
                header: () => <div className="text-right">Aksi</div>,
                cell: ({ row }) => (
                    <div className="flex justify-end gap-2">
                        <Link href={`/projects/${row.original.id}`}>
                            <Button variant="ghost" size="icon" title={t("details")}>
                                <Eye className="size-4" />
                            </Button>
                        </Link>
                    </div>
                ),
            },
        ],
        [t]
    );

    const table = useReactTable({
        data: projects,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="border rounded-xl bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-muted/50">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Memuat data...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                {t("noProjects")}
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="hover:bg-muted/30 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
