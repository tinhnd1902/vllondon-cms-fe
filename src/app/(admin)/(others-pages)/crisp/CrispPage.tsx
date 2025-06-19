"use client"
import React, {useState, useEffect, useCallback} from "react";
import {
    Table,
    TableBodyLazy,
    TableCell,
    TableHeader,
    TableRow,
    TableStatus,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import {ReloadIcon} from "@/assets/icons";
import {useTranslation} from "react-i18next";
import {CrispConfigResponse, CrispKeyPayload, CrispWebsitePayload} from "@/modules/crisp/crisp.module";
import CrispService from "@/services/crisp.service";
import TotalPagination from "@/components/tables/TotalPagination";
import {MetaResponse} from "@/modules/api/utils.module";
import CrispDetailModal from "@/components/crisp/CrispDetailModal";
import CrispModal from "@/components/crisp/CrispModal";
import Toast, {ToastInfo, ToastVariant} from '@/components/ui/toast/Toast';
import {CrispModalState} from "@/components/crisp/CrispModalState";
import CrispWebsiteModal from "@/components/crisp/CrispWebsiteModal";

export default function CrispPage() {
    const [tableData, setTableData] = useState<CrispConfigResponse[]>([]);
    const [tableStatus, setTableStatus] = useState<TableStatus>(TableStatus.INITIAL);
    const [toastInfo, setToastInfo] = useState<ToastInfo>({show: false, message: '', variant: ToastVariant.SUCCESS});
    const [meta, setMeta] = useState<MetaResponse>({page: 1, totalPages: 1, total: 0, limit: 10})
    const [state, setState] = useState<CrispModalState>(CrispModalState.NORMAL)
    const {t} = useTranslation();

    useEffect(() => {
        fetchAllConfig();
    }, [meta.page, meta.limit]);

    const fetchAllConfig = () => {
        setTableStatus(TableStatus.LOADING);
        setState(CrispModalState.NORMAL);
        console.log(meta)
        CrispService.getAllCrisp(meta.page, meta.limit)
            .then((response) => {
                setTableData(response.data);
                setMeta(response.meta);
                setTableStatus(response.meta.total > 0 ? TableStatus.SUCCESS : TableStatus.ERROR);
            })
            .catch((error) => {
                setTableStatus(TableStatus.ERROR);
            });
    }

    const onCreateKey = (payload: CrispKeyPayload) => {
        CrispService.createSetKey(payload)
            .then((response) => {
                setState(CrispModalState.HIDDEN_CREATE);
                setToastInfo({
                    show: true,
                    message: t("crisp.create_success"),
                    variant: ToastVariant.SUCCESS
                });
                setTimeout(() => {
                    fetchAllConfig();
                }, 1000);
            })
            .catch((error) => {
                setToastInfo({
                    show: true,
                    message: `${t("crisp.create_failed")} ${error.message}`,
                    variant: ToastVariant.ERROR
                });
            });
    }

    const onUpdateKey = (key: string, payload: CrispWebsitePayload) => {
        CrispService.createSetWebsite(key, payload)
            .then((response) => {
                setState(CrispModalState.HIDDEN_ADD_WEBSITE);
                setToastInfo({
                    show: true,
                    message: t("crisp.add_website_success"),
                    variant: ToastVariant.SUCCESS
                });
                setTimeout(() => {
                    fetchAllConfig();
                }, 1000);
            })
            .catch((error) => {
                setToastInfo({
                    show: true,
                    message: `${t("crisp.add_website_failed")} ${error.message}`,
                    variant: ToastVariant.ERROR
                });
            });
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
        <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
        >
            {/* Card Header */}
            <div className="px-6 py-5 flex justify-between">
                <div>
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                        {t("crisp.config_info")}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {t("crisp.config_list_info")}
                    </p>
                </div>
                <div className="gap-2 flex items-center">
                    <Button className="bg-blue-300" size="sm" variant="primary"
                            startIcon={<ReloadIcon/>}
                            onClick={fetchAllConfig}
                    />
                    <CrispModal onSubmit={onCreateKey} state={state}/>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                <div className="space-y-6">
                    <div
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                <Table>
                                    {/* Table Header */}
                                    <TableHeader
                                        className="border-b border-gray-100 dark:border-white/[0.05] bg-white/[0.1]">
                                        <TableRow>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-large text-gray-500 text-start text-theme-lg dark:text-gray-400"
                                            >
                                                {t("crisp.key")}
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-large text-gray-500 text-start text-theme-lg dark:text-gray-400"
                                            >
                                                {t("crisp.total_website")}
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-large text-gray-500 text-start text-theme-lg dark:text-gray-400"
                                            >
                                                {t("crisp.created_date")}
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 w-3xs font-large text-gray-500 text-start text-theme-lg dark:text-gray-400"
                                            >
                                                {t("crisp.action")}
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    {/* Table Body */}
                                    <TableBodyLazy className="divide-y divide-gray-100 dark:divide-white/[0.05]"
                                                   status={tableStatus}>
                                        {tableData.map((crisp) => (
                                            <TableRow key={crisp.id}>
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                    <span
                                                        className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {crisp.crispTokenIdentifier}
                                                    </span>
                                                    <span
                                                        className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {crisp.crispTokenKey}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {crisp.websites?.length}
                                                </TableCell>
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                    {getDateTime(crisp.createdAt)}
                                                </TableCell>
                                                <TableCell
                                                    className="px-4 py-3 w-3xs text-gray-500 text-theme-sm dark:text-gray-400">
                                                    <div className="flex gap-2">
                                                        <CrispDetailModal crisp={crisp}/>
                                                        <CrispWebsiteModal
                                                            onSubmit={(payload) => onUpdateKey(crisp.id, payload)}
                                                            state={state}/>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBodyLazy>
                                </Table>
                            </div>
                        </div>
                    </div>
                    <TotalPagination
                        currentPage={meta.page}
                        totalPages={meta.totalPages}
                        total={meta.total}
                        onPageChange={(value) => {
                            setMeta((prevState) => ({
                                ...prevState,
                                page: value
                            }));
                        }}
                        onLimitChange={(value) => {
                            setMeta((prevState) => ({
                                ...prevState,
                                limit: value
                            }));
                        }}
                    />
                </div>
            </div>
            <Toast
                variant={toastInfo.variant}
                title={t("notification")}
                message={toastInfo.message}
                show={toastInfo.show}
                onClose={() => setToastInfo({show: false, message: '', variant: ToastVariant.SUCCESS})}
            />
        </div>
    );
}