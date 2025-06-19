import Button from "@/components/ui/button/Button";
import {PageRightIcon, PageLeftIcon, ChevronDownIcon} from '@/assets/icons'
import Select from "@/components/form/Select";
import React, {useState} from "react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
};

const TotalPagination: React.FC<PaginationProps> = ({
                                                        currentPage,
                                                        totalPages,
                                                        total,
                                                        onPageChange,
                                                        onLimitChange
                                                    }) => {
    const [limit, setLimit] = useState(10)
    const pagesAroundCurrent = Array.from(
        {length: Math.min(3, totalPages)},
        (_, i) => i + Math.max(currentPage - 1, 1)
    );

    const options: { value: string, label: string }[] = [10, 20, 30, 50].map((res) => ({
        value: res.toString(),
        label: res.toString()
    }));

    return (
        <div className="flex justify-between">
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <span>Hiển thị tối đa</span>
                <div className="relative">
                    <Select
                        options={options}
                        placeholder={limit.toString()}
                        onChange={(value) => {
                            const newLimit: number = Number(value)
                            onLimitChange(newLimit)
                            setLimit(newLimit)
                        }}
                        className="dark:bg-dark-900"
                        defaultValue={limit.toString()}
                    />
                    <span
                        className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
                    >
                        <ChevronDownIcon/>
                    </span>
                </div>
                <span>trong tổng</span>
                <span className="text-base font-semibold dark:text-gray-400 text-gray-700">{total}</span>
            </div>
            <div className="flex items-center ">
                <Button
                    className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm"
                    startIcon={<PageLeftIcon/>}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                <div className="flex items-center gap-2">
                    {currentPage > 3 && <span className="px-2">...</span>}
                    {pagesAroundCurrent.map((page) => (
                        <Button
                            key={page}
                            onClick={() => onPageChange(page)}
                            disabled={currentPage === page}
                            className={`px-4 py-2 rounded ${currentPage === page
                                ? "disabled:bg-brand-500 disabled:text-white disabled:opacity-100 dark:disabled:hover:text-white"
                                : "text-gray-700 dark:text-gray-400"
                            } flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500`}
                        >
                            {page}
                        </Button>
                    ))}
                    {currentPage < totalPages - 2 && <span className="px-2">...</span>}
                </div>
                <Button
                    className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                    startIcon={<PageRightIcon/>}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </div>
        </div>
    );
};

export default TotalPagination;
