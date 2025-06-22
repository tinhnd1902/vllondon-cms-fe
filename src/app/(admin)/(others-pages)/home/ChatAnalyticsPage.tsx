"use client";
import React, { useEffect, useState, useCallback } from "react";
import { StatisticItem, StatisticsOverView } from "@/components/chat-analytics/StatisticsOverview";
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
import ChatListOverview from "@/components/chat-analytics/ChatListOverview";
import { toast } from "@/hooks/use-toast";
import StatisticsChart from "@/components/chat-analytics/StatisticsChart";
import { useTranslation } from 'react-i18next';
import {BlockResponse, SessionResponse} from "@/modules/crisp/session.module";
import { MetaResponse } from "@/modules/api/utils.module";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Search } from "lucide-react";
import Input from "@/components/form/input/InputField";
import { SentimentStatus } from "@/modules/crisp/crisp.module";

export default function ChatAnalyticsPage() {
    const { t } = useTranslation();
    const [statisticOverview, setStatisticOverview] = useState<StatisticItem[]>([]);
    const [statisticsTable, setStatisticsTable] = useState<StatisticsTableItem[]>([]);

    const [session, setSession] = useState<SessionResponse[]>([]);
    const [metaSession, setMetaSession] = useState<MetaResponse>({ page: 1, totalPages: 1, total: 0, limit: 5 })
    const [sessionSelected, setSessionSelected] = useState<SessionResponse | null>(null);
    const META_BLOCK_DEFAULT = { page: 1, totalPages: 1, total: 0, limit: 3 };
    const [metaBlock, setMetaBlock] = useState<MetaResponse>(META_BLOCK_DEFAULT);
    const [block, setBlock] = useState<BlockResponse[]>([]);

    const levelOptions = [
        {key: "all", value: t("chat_list_overview.all")},
        {key: String(SentimentStatus.POSITIVE), value: t("chat_list_overview.satisfied")},
        {key: String(SentimentStatus.NEUTRAL), value: t("chat_list_overview.neutral")},
        {key: String(SentimentStatus.NEGATIVE), value: t("chat_list_overview.unsatisfied")},
        {key: String(SentimentStatus.NONE), value: t("chat_list_overview.undefined")},
    ]
    const [selectedFilter, setSelectedFilter] = useState(levelOptions.at(0));
    const [selectedProduct, setSelectedProduct] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    // const products = [...new Set(data.map(chat => chat.product))];

    const satisfactionDistribution = [
        { name: "Hài lòng", value: 75, color: "#22c55e" },
        { name: "Không hài lòng", value: 25, color: "#ef4444" }
    ];

    useEffect(() => {
        fetchAllSession();
    }, [metaSession.page, metaSession.limit]);

    useEffect(() => {
        if (sessionSelected) {
            fetchAllBlockBy(sessionSelected);
        }
    }, [metaBlock.page, metaBlock.limit]);

    const updateStatisticOverview = useCallback(() => {
        // const totalStatisfied = session.filter((res) => res.sentiment == SentimentStatus.POSITIVE).length;
        // const totalNotStatisfied = session.filter((res) => res.sentiment == SentimentStatus.NEGATIVE).length;
        // const totalNone = session.filter((res) => res.sentiment === null).length;
        // const total = session.length;
        // const data: StatisticItem[] = [
        //     {
        //         value: total.toString(),
        //         type: StatisticType.TOTAL_CONVERSATION
        //     },
        //     {
        //         value: totalStatisfied.toString(),
        //         type: StatisticType.SATISFIED
        //     },
        //     {
        //         value: totalNotStatisfied.toString(),
        //         type: StatisticType.NOT_SATISFIED
        //     },
        //     {
        //         value: `~${((+totalStatisfied / (+total - +totalNone)) * 100).toFixed(3).replace(/\.?0+$/, "")}%`,
        //         type: StatisticType.SATISFACTION_RATE
        //     }
        // ]
        // setStatisticOverview(data)
    }, [session]);

    const updateStatisticsTable = useCallback(() => {
        // const data: StatisticsTableItem[] = session
        //     .filter((res) => res.sentiment !== SentimentStatus.POSITIVE)
        //     .map((res) => {
        //         return {
        //             id: res.id,
        //             name: res.assigned.user_id,
        //             total: 0,
        //             totalNotSatisfied: 0,
        //             dissatisfactionRate: `${res.sessionId}%`
        //         }
        //     })
        // setStatisticsTable(data)
    }, [session]);

    const updateChatList = useCallback(() => {
        // const data: Conversation[] = session
        //     .map((res) => {
        //         // let customer = `User${res.id}`;
        //         let customer = `${res.assigned.user_id}`;
        //         const messsages = res.metaData.map((chat) => {
        //             let user = "";
        //             if (chat.user && chat.from === ConversationForm.OPERATOR) {
        //                 user = chat.user.nickname;
        //             }
        //             return {
        //                 type: chat.type,
        //                 user: user,
        //                 sender: chat.from,
        //                 content: chat.content,
        //                 time: new Date(chat.timestamp).toLocaleTimeString()
        //             }
        //         })
        //         return {
        //             id: res.id,
        //             customer: customer,
        //             sentiment: res.sentiment || SentimentStatus.NONE,
        //             product: res.conversationTopic || "SP None",
        //             time: new Date(res.createdAt).toLocaleDateString(),
        //             messages: messsages
        //         }
        //     })
        // setChatList(data)
    }, [session]);

    const fetchAllSession = () => {
        CrispService.getAllSessions(metaSession.page, metaSession.limit)
            .then((response) => {
                setSession((prevState) => {
                    return metaSession.page === 1 ? response.data : [...prevState, ...response.data];
                });
                setMetaSession(response.meta);
            })
            .catch((error) => {
                toast({
                    title: 'Error',
                    description: `This is an error message.' ${error}`,
                    variant: 'destructive',
                });
            });
    }

    const fetchAllBlockBy = (session: SessionResponse) => {
        setSessionSelected(session);
        CrispService.getAllBlocks(session.id, metaBlock.page, metaBlock.limit)
            .then((response) => {
                setBlock((prevState) => {
                    return metaBlock.page === 1 ? response.data : [...response.data, ...prevState];
                });
                setMetaBlock(response.meta);
            })
            .catch((error) => {
                toast({
                    title: 'Error',
                    description: `This is an error message.' ${error}`,
                    variant: 'destructive',
                });
            });
    }

    const onSelectedSession = (session: SessionResponse) => {
        setMetaBlock(META_BLOCK_DEFAULT);
        fetchAllBlockBy(session);
    }

    const onLoadMore = (isSession: boolean) => {
        if (isSession) {
            let page = metaSession.page + 1
            if (page > metaSession.totalPages) { return }
            setMetaSession((prevState) => ({
                ...prevState,
                page: page
            }));
            return;
        }
        let page = metaBlock.page + 1
        if (page > metaBlock.totalPages) { return }
        setMetaBlock((prevState) => ({
            ...prevState,
            page: page
        }));
    }

    useEffect(() => {
        updateStatisticOverview();
        updateStatisticsTable();
        updateChatList();
    }, [session, updateStatisticOverview, updateStatisticsTable, updateChatList]);

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12">
                <StatisticsOverView data={statisticOverview} />
            </div>

            <div className="col-span-12 space-y-6">
                <ComponentCard title={t("chat_list_overview.filter_title")} titleSize="text-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">{t("chat_list_overview.satisfaction_level")}</label>
                            <Select value={selectedFilter?.key} onValueChange={(res) => {
                                // setSelectedChat(null);
                                setSelectedFilter(levelOptions.filter((item) => res === item.key).at(0))
                            }}>
                                <SelectTrigger className="dark:border-slate-600 dark:text-white dark:bg-gray-500 text-blue-500 forced-color-adjust-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:text-gray-400 bg-white">
                                    {levelOptions.map((item) => {
                                        return <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">{t("chat_list_overview.product")}</label>
                            <Select value={selectedProduct} onValueChange={(res) => {
                                // setSelectedChat(null)
                                setSelectedProduct(res)
                            }}>
                                <SelectTrigger className="dark:border-slate-600 dark:text-white dark:bg-gray-500 text-blue-500 forced-color-adjust-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:text-gray-400 bg-white">
                                    <SelectItem value="all">{t("chat_list_overview.all_products")}</SelectItem>
                                    {/*{products.map(product => (*/}
                                    {/*    <SelectItem key={product} value={String(product)}>{product}</SelectItem>*/}
                                    {/*))}*/}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">{t("chat_list_overview.search")}</label>
                            <div className="relative ">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 dark:text-white text-blue-500" />
                                <Input
                                    placeholder={t("chat_list_overview.search_placeholder")}
                                    defaultValue={searchTerm}
                                    onChange={(e) => {
                                        // setSelectedChat(null)
                                        setSearchTerm(e.target.value)
                                    }}
                                    className="pl-10 dark:border-slate-600 dark:text-white dark:bg-gray-500 bg-white text-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </ComponentCard>

                <Tabs defaultValue="chats" className="space-y-0 ">
                    <TabsList className="grid grid-cols-12 p-0">
                        <TabsTrigger value="chats"
                            className="rounded-none rounded-tl-2xl bg-gray-100 p-0.5 dark:bg-gray-900 xl:col-span-2 col-span-4 py-2.5 data-[state=active]:shadow-theme-xs data-[state=active]:text-gray-900 data-[state=active]:dark:text-white data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            {t("chat_analytics_page.chat_list")}
                        </TabsTrigger>
                        <TabsTrigger value="stats"
                            className="rounded-none rounded-tr-2xl bg-gray-100 p-0.5 dark:bg-gray-900 xl:col-span-2 col-span-4 py-2.5 data-[state=active]:shadow-theme-xs data-[state=active]:text-gray-900 data-[state=active]:dark:text-white data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            {t("chat_analytics_page.statistics")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="chats"
                        className="space-y-6 mt-0 rounded-e-2xl rounded-b-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <ChatListOverview dataSession={session} dataBlock={block} onLoadMore={onLoadMore} onSelected={onSelectedSession}/>
                    </TabsContent>

                    <TabsContent value="stats"
                        className="space-y-6 mt-0 rounded-e-2xl rounded-b-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <StatisticsTable data={statisticsTable} />
                        <div className="grid lg:grid-cols-2 gap-6">
                            <ComponentCard title={t("chat_analytics_page.not_satisfied_weekly")}>
                                <StatisticsChart />
                            </ComponentCard>
                            <ComponentCard title={t("chat_analytics_page.not_satisfied_monthly")}>
                                <StatisticsChart />
                            </ComponentCard>
                        </div>
                        <ComponentCard title={t("chat_analytics_page.satisfaction_distribution")}>
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
                </Tabs>
            </div>
        </div>
    );
}