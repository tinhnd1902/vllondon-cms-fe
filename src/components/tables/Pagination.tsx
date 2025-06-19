import Button from "@/components/ui/button/Button";
import {PageRightIcon, PageLeftIcon, ChevronDownIcon} from '@/assets/icons'
import Select from "@/components/form/Select";
import React from "react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   onPageChange,
                                               }) => {
    const pagesAroundCurrent = Array.from(
        {length: Math.min(3, totalPages)},
        (_, i) => i + Math.max(currentPage - 1, 1)
    );

    return (
        <div className="flex items-center">
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
                        className={`px-4 py-2 rounded ${
                            currentPage === page
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
    );
};

export default Pagination;
