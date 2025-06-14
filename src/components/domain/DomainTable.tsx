"use client"
import React, { useState, useEffect } from "react";
import {
    Table,
    TableBodyLazy,
    TableCell,
    TableHeader,
    TableRow,
    TableStatus,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { DomainResponse, DomainStatus } from "@/modules/domain/domain.module";
import DomainService from "@/services/domain.service";
import DomainModal from "./DomainModal";
import DomainRemoveModal from "./DomainRemoveModal";
import "@/locales/i18n";
import { useTranslation } from "react-i18next";
import Button from "../ui/button/Button";
import { ReloadIcon } from "@/assets/icons";

export default function DomainTable() {
    const [tableData, setTableData] = useState<DomainResponse[]>([]);
    const [tableStatus, setTableStatus] = useState<TableStatus>(TableStatus.INITIAL);
    const { t } = useTranslation();

    useEffect(() => {
        fetchAllDomains();
    }, []);

    const fetchAllDomains = async () => {
        setTableStatus(TableStatus.LOADING);
        DomainService.getAllDomainsRequest()
            .then((response) => {
                response.sort((a: DomainResponse, b: DomainResponse) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB.getTime() - dateA.getTime();
                });
                setTableData(response);
                setTableStatus(response.length > 0 ? TableStatus.SUCCESS : TableStatus.ERROR);
            })
            .catch((error) => {
                setTableStatus(TableStatus.ERROR);
            });
    }

    const getColorStatus = (status: DomainStatus) => {
        switch (status) {
            case DomainStatus.ACTIVE:
                return "success";
            case DomainStatus.INACTIVE:
                return "error";
        }
    }

    const getDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    }

    return (
        <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}>
            {/* Card Header */}
            <div className="px-6 py-5 flex justify-between">
                <div>
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                        {t("domain.list")}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {t("domain.info")}
                    </p>
                </div>
                <div className="gap-2 flex items-center">
                    <Button className="bg-blue-300" size="sm" variant="primary"
                        startIcon={<ReloadIcon />}
                        onClick={fetchAllDomains}
                    />
                    <DomainModal isCreate onReload={fetchAllDomains} />
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                <div className="space-y-6">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                <Table>
                                    {/* Table Header */}
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white/[0.1]">
                                        <TableRow>
                                            <TableCell isHeader className="px-5 py-3 font-large text-gray-500 text-start text-theme-lg dark:text-gray-400">
                                                {t("domain.code")}
                                            </TableCell>
                                            <TableCell isHeader className="px-5 py-3 font-large text-gray-500 text-start text-theme-lg dark:text-gray-400">
                                                {t("domain.name")}
                                            </TableCell>
                                            <TableCell isHeader className="px-5 py-3 font-large text-gray-500 text-start text-theme-lg dark:text-gray-400">
                                                {t("domain.url")}
                                            </TableCell>
                                            <TableCell isHeader className="px-5 py-3 font-large text-gray-500 text-start text-theme-lg dark:text-gray-400">
                                                {t("domain.status")}
                                            </TableCell>
                                            <TableCell isHeader className="px-5 py-3 font-large text-gray-500 text-start text-theme-lg dark:text-gray-400">
                                                {t("domain.created_at")}
                                            </TableCell>
                                            <TableCell isHeader className="px-5 py-3 w-3xs font-large text-gray-500 text-start text-theme-lg dark:text-gray-400">
                                                {t("domain.action")}
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    {/* Table Body giữ nguyên */}
                                    <TableBodyLazy className="divide-y divide-gray-100 dark:divide-white/[0.05]" status={tableStatus}>
                                        {tableData.map((domain) => (
                                            <TableRow key={domain.id}>
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {domain.code}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {domain.name}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-blue-500 text-start text-theme-sm dark:text-blue-400">
                                                    <a href={domain.url} target="_blank">{domain.url}</a>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <Badge
                                                        size="sm"
                                                        color={getColorStatus(domain.status)}
                                                    >
                                                        {t(`domain.${domain.status}`)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                    {getDateTime(domain.createdAt)}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 w-3xs text-gray-500 text-theme-sm dark:text-gray-400">
                                                    <div className="flex gap-2">
                                                        <DomainModal domain={domain} isCreate={false} onReload={fetchAllDomains} />
                                                        <DomainRemoveModal domain={domain} onReload={fetchAllDomains} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBodyLazy>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}