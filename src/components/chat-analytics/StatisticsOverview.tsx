"use client";
import React from "react";
import { ChatIcon, LikeIcon, UplikeIcon, LucideIcon } from "@/assets/icons";

export enum StatisticType {
    TOTAL_CONVERSATION,
    SATISFIED,
    NOT_SATISFIED,
    SATISFACTION_RATE,
}

export interface StatisticItem {
    value: string;
    type: StatisticType
}

export interface StatisticsOverViewProps {
    data: StatisticItem[]
}

export const StatisticsOverView: React.FC<StatisticsOverViewProps> = ({
    data = []
}) => {
    const updateTitle = (item: StatisticItem) => {
        switch (item.type) {
            case StatisticType.TOTAL_CONVERSATION:
                return "Tổng cuộc hội thoại"
            case StatisticType.SATISFIED:
                return "Khách hài lòng"
            case StatisticType.NOT_SATISFIED:
                return "Khách không hài lòng"
            case StatisticType.SATISFACTION_RATE:
                return "Tỷ lệ hài lòng"
        }
    }

    const updateColor = (item: StatisticItem) => {
        switch (item.type) {
            case StatisticType.TOTAL_CONVERSATION:
                return "text-gray-800 dark:text-white/90"
            case StatisticType.SATISFIED:
                return "text-green-600 dark:text-green-400"
            case StatisticType.NOT_SATISFIED:
                return "text-red-400 dark:text-red-400"
            case StatisticType.SATISFACTION_RATE:
                return "text-blue-400 dark:text-blue-400"
        }
    }

    const getIcon = (item: StatisticItem) => {
        switch (item.type) {
            case StatisticType.TOTAL_CONVERSATION:
                return <ChatIcon className={`size-6 ${updateColor(item)}`} />;
            case StatisticType.SATISFIED:
                return <LikeIcon className={`size-6 ${updateColor(item)}`} />;
            case StatisticType.NOT_SATISFIED:
                return <UplikeIcon className={`size-6 ${updateColor(item)}`} />;
            case StatisticType.SATISFACTION_RATE:
                return <LucideIcon className={`size-6 ${updateColor(item)}`} />;
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
            {data.map((item) => (
                <div key={item.type} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <div className="flex items-end justify-between">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {updateTitle(item)}
                            </span>
                            <h4 className={`mt-2 font-bold text-title-sm ${updateColor(item)}`}>
                                {item.value}
                            </h4>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            {getIcon(item)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};