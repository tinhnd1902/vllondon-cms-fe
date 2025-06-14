"use client";
import React, { useEffect, useState, useCallback } from "react";
import { StatisticItem, StatisticsOverView, StatisticType } from "@/components/chat-analytics/StatisticsOverview";
import { ConversationForm, ConversationResponse, SentimentStatus } from "@/modules/crisp/crisp.module";
import CrispService from "@/services/crisp.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/ai/tabs";
import {
    Tooltip,
    PieChart,
    Pie,
    Cell
} from "recharts";
import StatisticsTable, { StatisticsTableItem } from "@/components/chat-analytics/StatisticsTable";
import ComponentCard from "@/components/common/ComponentCard";
import ChatListOverview, { Conversation } from "@/components/chat-analytics/ChatListOverview";
import { toast } from "@/hooks/use-toast";
import StatisticsChart from "@/components/chat-analytics/StatisticsChart";

export default function ChatAnalyticsPage() {
    const [conversations, setConversations] = useState<ConversationResponse[]>([]);
    const [statisticOverview, setStatisticOverview] = useState<StatisticItem[]>([]);
    const [statisticsTable, setStatisticsTable] = useState<StatisticsTableItem[]>([]);
    const [chatList, setChatList] = useState<Conversation[]>([]);
    const satisfactionDistribution = [
        { name: "Hài lòng", value: 75, color: "#22c55e" },
        { name: "Không hài lòng", value: 25, color: "#ef4444" }
    ];

    useEffect(() => {
        fetchAllConversations();
    }, []);

    const updateStatisticOVerview = useCallback(() => {
        const totalStatisfied = conversations.filter((res) => res.sentiment == SentimentStatus.POSITIVE).length;
        const total = conversations.length;
        const data: StatisticItem[] = [
            {
                value: total.toString(),
                type: StatisticType.TOTAL_CONVERSATION
            },
            {
                value: totalStatisfied.toString(),
                type: StatisticType.SATISFIED
            },
            {
                value: (total - totalStatisfied).toString(),
                type: StatisticType.NOT_SATISFIED
            },
            {
                value: `${(totalStatisfied / total)}%`,
                type: StatisticType.SATISFACTION_RATE
            }
        ]
        setStatisticOverview(data)
    }, [conversations]);

    const updateStatisticsTable = useCallback(() => {
        const data: StatisticsTableItem[] = conversations
            .filter((res) => res.sentiment !== SentimentStatus.POSITIVE)
            .map((res) => {
                return {
                    id: res.id,
                    name: res.conversationTopic,
                    total: 0,
                    totalNotSatisfied: 0,
                    dissatisfactionRate: `${res.websiteId}%`
                }
            })
        setStatisticsTable(data)
    }, [conversations]);

    const updateChatList = useCallback(() => {
        const data: Conversation[] = conversations
            .map((res) => {
                let customer = `User${res.id}`;
                const messsages = res.metaData.map((chat) => {
                    if (chat.user && chat.from === ConversationForm.USER) {
                        customer = chat.user.nickname;
                    }
                    return {
                        type: chat.type,
                        sender: chat.from,
                        content: chat.content,
                        time: new Date(chat.timestamp).toLocaleTimeString()
                    }
                })
                return {
                    id: res.id,
                    customer: customer,
                    sentiment: res.sentiment || SentimentStatus.NONE,
                    product: res.conversationTopic || "SP None",
                    time: new Date(res.createdAt).toLocaleDateString(),
                    messages: messsages
                }
            })
        setChatList(data)
    }, [conversations]);

    const fetchAllConversations = async () => {
        CrispService.getAllConversationRequest()
            .then((response) => {
                setConversations(response);
            })
            .catch((error) => {
                toast({
                    title: 'Error',
                    description: `This is an error message.' ${error}`,
                    variant: 'destructive', // Assuming you have a 'destructive' variant
                });
            });
    }

    useEffect(() => {
        updateStatisticOVerview();
        updateStatisticsTable();
        updateChatList();
    }, [conversations, updateStatisticOVerview, updateStatisticsTable, updateChatList]);

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12">
                <StatisticsOverView data={statisticOverview} />
            </div>

            <div className="col-span-12">
                <Tabs defaultValue="chats" className="space-y-0 ">
                    <TabsList className="grid grid-cols-12 p-0">
                        <TabsTrigger value="chats" className="rounded-none rounded-tl-2xl bg-gray-100 p-0.5 dark:bg-gray-900 xl:col-span-2 col-span-4 py-2.5 data-[state=active]:shadow-theme-xs data-[state=active]:text-gray-900 data-[state=active]:dark:text-white data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Danh sách Chat
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="rounded-none rounded-tr-2xl bg-gray-100 p-0.5 dark:bg-gray-900 xl:col-span-2 col-span-4 py-2.5 data-[state=active]:shadow-theme-xs data-[state=active]:text-gray-900 data-[state=active]:dark:text-white data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Thống kê
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="chats" className="space-y-6 mt-0 rounded-e-2xl rounded-b-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <ChatListOverview data={chatList} />
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-6 mt-0 rounded-e-2xl rounded-b-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <StatisticsTable data={statisticsTable} />
                        <div className="grid lg:grid-cols-2 gap-6">
                            <ComponentCard title="Chat không hài lòng theo tuần">
                                <StatisticsChart />
                            </ComponentCard>
                            <ComponentCard title="Chat không hài lòng theo tháng">
                                <StatisticsChart />
                            </ComponentCard>
                        </div>
                        <ComponentCard title="Phân bổ mức độ hài lòng">
                            <div className="flex items-center justify-center">
                                <PieChart width={800} height={300}>
                                    <Pie
                                        data={satisfactionDistribution}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}%`}
                                    >
                                        {satisfactionDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </div>
                        </ComponentCard>
                    </TabsContent>
                </Tabs >
            </div >
        </div >
    );
}