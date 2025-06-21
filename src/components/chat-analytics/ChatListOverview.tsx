import ComponentCard from "../common/ComponentCard";
import {Calendar, Eye, Package, User} from "lucide-react";
import React, {useState} from "react";
import Badge from "../ui/badge/Badge";
import {ConversationForm, SentimentStatus} from "@/modules/crisp/crisp.module";
import {useTranslation} from "react-i18next";
import {BlockResponse, SessionResponse} from "@/modules/crisp/session.module";
import {useRef, useEffect} from "react";

export interface ChatListOverviewProps {
    dataSession: SessionResponse[];
    dataBlock: BlockResponse[];
    onSelected: (selected: SessionResponse) => void;
    onLoadMore: (isSession: boolean) => void;
}

const ChatListOverview: React.FC<ChatListOverviewProps> = (
    {
        dataSession = [],
        dataBlock = [],
        onSelected,
        onLoadMore
    }) => {
    const {t} = useTranslation();

    const levelOptions = [
        {key: "all", value: t("chat_list_overview.all")},
        {key: String(SentimentStatus.POSITIVE), value: t("chat_list_overview.satisfied")},
        {key: String(SentimentStatus.NEUTRAL), value: t("chat_list_overview.neutral")},
        {key: String(SentimentStatus.NEGATIVE), value: t("chat_list_overview.unsatisfied")},
        {key: String(SentimentStatus.NONE), value: t("chat_list_overview.undefined")},
    ]
    const [selected, setSelected] = useState<SessionResponse | null>(null);
    const [loadingSession, setLoadingSession] = useState(false);
    const [loadingBlock, setLoadingBlock] = useState(false);

    const sessionRef = useRef<HTMLDivElement>(null);
    const blockRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (blockRef.current) {
            blockRef.current.scrollTop = blockRef.current.scrollHeight;
        }
    }, [selected, dataBlock]);

    const updateSelected = (item: SessionResponse) => {
        setSelected(item);
        onSelected(item);
    }

    const updateStaff = (item: SessionResponse) => {
        return item.compose.operator[item.assigned.user_id].user.nickname
    }

    const updateBadge = (item: SessionResponse | BlockResponse) => {
        let color: "success" | "warning" | "error" | "info";
        let sentiment = item.sentiment || SentimentStatus.NONE
        switch (sentiment) {
            case SentimentStatus.POSITIVE:
                color = "success";
                break;
            case SentimentStatus.NEUTRAL:
                color = "warning";
                break;
            case SentimentStatus.NEGATIVE:
                color = "error";
                break;
            default:
                color = "info";
                break;
        }

        return <Badge variant="solid" color={color}>
            {levelOptions.filter((item) => item.key === sentiment).at(0)?.value}
        </Badge>
    }

    return (
        <>
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Chat List */}
                <ComponentCard
                    className="col-span-2"
                    title={t("chat_list_overview.chat_list")}
                    // desc={`${t("chat_list_overview.total_conversations")}: ${dataSession.length}`}
                >
                    <div
                        ref={sessionRef}
                        className="space-y-4 max-h-96 overflow-y-auto"
                        onScroll={e => {
                            const target = e.currentTarget;
                            if (
                                !loadingSession &&
                                target.scrollTop + target.clientHeight >= target.scrollHeight - 10
                            ) {
                                target.scrollTop = target.scrollTop - 1;
                                setLoadingSession(true);
                                onLoadMore(true);
                                setTimeout(() => setLoadingSession(false), 1000);
                            }
                        }}
                    >
                        {dataSession.map((item: SessionResponse) => (
                            <div
                                key={item.id}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${selected?.id === item.id
                                    ? 'dark:bg-blue-600/20 dark:border-blue-500 bg-blue-500/20 border-blue-400'
                                    : 'dark:bg-slate-700/50 dark:border-slate-600 dark:hover:bg-slate-700 bg-white border-white-400 hover:bg-gray-200'
                                }`}
                                onClick={() => updateSelected(item)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium dark:text-white text-black">{item.meta.nickname}</span>
                                    {updateBadge(item)}
                                </div>
                                <div className="flex items-center space-x-2 text-sm dark:text-gray-400 text-gray-600">
                                    <Package className="w-4 h-4"/>
                                    <span>{item.topic ?? "SP None"}</span>
                                    <User className="w-4 h-4 ml-2"/>
                                    <span>{updateStaff(item)}</span>
                                    <Calendar className="w-4 h-4 ml-2"/>
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm dark:text-gray-300 text-gray-400 mt-2 truncate">
                                    {item.lastMessage}
                                </p>
                            </div>
                        ))}
                        {loadingSession && (
                            <div className="flex justify-center py-4">
                                <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></span>
                                <span className="ml-2 text-gray-500">Loading...</span>
                            </div>
                        )}
                    </div>
                </ComponentCard>

                <ComponentCard
                    className="col-span-3"
                    title={selected ? t("chat_list_overview.chat_details") : t("chat_list_overview.select_chat_details")}
                    desc={selected ? `${t("chat_list_overview.conversation_with")} ${selected.meta.nickname}` : ""}
                    // titleSize="text-2xl"
                >
                    {selected ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Package className="w-4 h-4 text-gray-400"/>
                                    <span
                                        className="dark:text-white text-black">{selected.topic ?? "SP None"}</span>
                                </div>
                                {updateBadge(selected)}
                            </div>

                            <div
                                ref={blockRef}
                                className="max-h-86 overflow-y-auto space-y-3"
                                onScroll={e => {
                                    const target = e.currentTarget;
                                    if (
                                        !loadingBlock &&
                                        target.scrollTop <= 0
                                    ) {
                                        setLoadingBlock(true);
                                        onLoadMore(false);
                                        setTimeout(() => setLoadingBlock(false), 1000);
                                    }
                                }}
                            >
                                {loadingBlock && (
                                    <div className="flex justify-center py-4">
                                        <span
                                            className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></span>
                                        <span className="ml-2 text-gray-500">Loading...</span>
                                    </div>
                                )}
                                {dataBlock.map((block) => (
                                    <div key={block.id} className="space-y-2">
                                        <div
                                            className="flex items-center justify-between text-sm dark:text-gray-400 text-gray-600 mt-5"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Package className="w-4 h-4"/>
                                                <span>{block.topic ?? "SP None"}</span>
                                                <Calendar className="w-4 h-4 ml-2"/>
                                                <span>{new Date(block.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {updateBadge(block)}
                                        </div>
                                        {block.messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`p-3 rounded-lg ${message.from === ConversationForm.USER
                                                    ? "border-l-4 border-blue-500 dark:bg-blue-600/20 bg-blue-800/20"
                                                    : "bg-green-600/20 border-l-4 border-green-500"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium dark:text-white text-gray-800">
                                                        {message.from === ConversationForm.USER ? t("chat_list_overview.customer") : t("chat_list_overview.agent")}
                                                    </span>
                                                    <span
                                                        className="text-xs dark:text-gray-400 text-gray-600">{new Date(Number(message.timestamp)).toLocaleTimeString()}</span>
                                                </div>
                                                <p className="dark:text-gray-300 text-gray-500 break-words">
                                                    {typeof message.content === "string" ? message.content : JSON.stringify(message.content)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50"/>
                            <p>{t("chat_list_overview.select_chat_message")}</p>
                        </div>
                    )}
                </ComponentCard>
            </div>
        </>
    );
}

export default ChatListOverview;