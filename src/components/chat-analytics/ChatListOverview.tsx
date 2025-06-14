import ComponentCard from "../common/ComponentCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/ai/select";
import { Calendar, Eye, Package, Search } from "lucide-react";
import { Input } from "@/components/ui/ai/input";
import { useState } from "react";
import Badge from "../ui/badge/Badge";
import { ConversationForm, ConversationType, CrispMetaDataContent, SentimentStatus } from "@/modules/crisp/crisp.module";
import Image from "next/image";

export interface Conversation {
    id: string;
    customer: string;
    sentiment: SentimentStatus | SentimentStatus.NONE;
    product: string | null;
    time: string;
    messages: {
        type: ConversationType;
        sender: ConversationForm;
        content: string | CrispMetaDataContent;
        time: string;
    }[]

}
export interface ChatListOverviewProps {
    data: Conversation[]
}

const ChatListOverview: React.FC<ChatListOverviewProps> = ({
    data = []
}) => {
    const levelOptions = [
        { key: "all", value: "Tất cả" },
        { key: String(SentimentStatus.POSITIVE), value: "Hài lòng" },
        { key: String(SentimentStatus.NEUTRAL), value: "Trung lập" },
        { key: String(SentimentStatus.NEGATIVE), value: "Không hài lòng" },
        { key: String(SentimentStatus.NONE), value: "Chưa xác định" },
    ]
    const [selectedFilter, setSelectedFilter] = useState(levelOptions.at(0));
    const [selectedProduct, setSelectedProduct] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);

    const filteredChats = data.filter(chat => {
        const matchesFilter =
            selectedFilter?.key === "all" ||
            String(chat.sentiment) === selectedFilter?.key;
        const matchesProduct = selectedProduct === "all" || chat.product === selectedProduct;
        const matchesSearch = searchTerm === "" ||
            chat.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (chat.product && chat.product.toLowerCase().includes(searchTerm.toLowerCase())) ||
            chat.messages.some(msg =>
                typeof msg.content === "string"
                    ? msg.content.toLowerCase().includes(searchTerm.toLowerCase())
                    : JSON.stringify(msg.content).toLowerCase().includes(searchTerm.toLowerCase())
            );

        return matchesFilter && matchesProduct && matchesSearch;
    });

    const products = [...new Set(data.map(chat => chat.product))];

    const updateBadge = (chat: Conversation) => {
        let color: "success" | "warning" | "error" | "info" = "error";
        switch (chat.sentiment) {
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
            {levelOptions.filter((item) => item.key === chat.sentiment).at(0)?.value}
        </Badge>
    }

    const updateContent = (message: {
        type: ConversationType;
        sender: ConversationForm;
        content: string | CrispMetaDataContent;
        time: string;
    }) => {
        console.log("message.content ", message.content, typeof message.content, message.type);

        if (message.type === ConversationType.TEXT && typeof message.content === "string") {
            return <p className="dark:text-gray-300 text-gray-500">
                {message.content}
            </p>
        // } else if (message.type === ConversationType.FILE && typeof message.content === "object") {
        //     return <Image
        //         src={message.content.url || "/images/grid-image/image-01.png"}
        //         alt="Cover"
        //         className="border border-gray-200 rounded-xl dark:border-gray-800"
        //         width={300}
        //         height={150}
        //     />
        } else {
            return <p className="dark:text-gray-300 text-gray-500">{JSON.stringify(message.content)}</p>
        }
    }

    return (
        <>
            <ComponentCard title="Bộ lọc" titleSize="text-2xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Mức độ hài lòng</label>
                        <Select value={selectedFilter?.key} onValueChange={(res) => setSelectedFilter(levelOptions.filter((item) => res === item.key).at(0))}>
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
                        <label className="text-sm text-gray-400 mb-2 block">Sản phẩm</label>
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger className="dark:border-slate-600 dark:text-white dark:bg-gray-500 text-blue-500 forced-color-adjust-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:text-gray-400 bg-white">
                                <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                                {products.map(product => (
                                    <SelectItem key={product} value={String(product)}>{product}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Tìm kiếm</label>
                        <div className="relative ">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 dark:text-white text-blue-500" />
                            <Input
                                placeholder="Tìm kiếm chat..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 dark:border-slate-600 dark:text-white dark:bg-gray-500 bg-white text-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </ComponentCard>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Chat List */}
                <ComponentCard title={`Danh sách Chat`} desc={`Tổng số hội thoại: ${filteredChats.length}`} titleSize="text-2xl">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedChat?.id === chat.id
                                    ? 'dark:bg-blue-600/20 dark:border-blue-500 bg-blue-500/20 border-blue-400'
                                    : 'dark:bg-slate-700/50 dark:border-slate-600 dark:hover:bg-slate-700 bg-white border-white-400 hover:bg-gray-200'
                                    }`}
                                onClick={() => setSelectedChat(chat)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium dark:text-white text-black">{chat.customer}</span>
                                    {updateBadge(chat)}
                                </div>
                                <div className="flex items-center space-x-2 text-sm dark:text-gray-400 text-gray-600">
                                    <Package className="w-4 h-4" />
                                    <span>{chat.product}</span>
                                    <Calendar className="w-4 h-4 ml-2" />
                                    <span>{chat.time}</span>
                                </div>
                                <p className="text-sm dark:text-gray-300 text-gray-400 mt-2 truncate">
                                    {typeof chat.messages[0]?.content === "string"
                                        ? chat.messages[0]?.content
                                        : JSON.stringify(chat.messages[0]?.content)}
                                </p>
                            </div>
                        ))}
                    </div>
                </ComponentCard>

                <ComponentCard
                    title={selectedChat ? "Chi tiết chat" : "Chọn chat để xem chi tiết"}
                    desc={selectedChat ? `Hội thoại với khách hàng: ${selectedChat.customer}` : ""}
                    titleSize="text-2xl"
                >
                    {selectedChat ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Package className="w-4 h-4 text-gray-400" />
                                    <span className="dark:text-white text-black">{selectedChat.product}</span>
                                </div>
                                {updateBadge(selectedChat)}
                            </div>

                            <div className="max-h-86 overflow-y-auto space-y-3">
                                {selectedChat.messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg ${message.sender === ConversationForm.USER
                                            ? "border-l-4 border-blue-500 dark:bg-blue-600/20 bg-blue-800/20"
                                            : "bg-green-600/20 border-l-4 border-green-500"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium dark:text-white text-gray-800">
                                                {message.sender === ConversationForm.USER ? "Khách hàng" : "Nhân viên"}
                                            </span>
                                            <span className="text-xs dark:text-gray-400 text-gray-600">{message.time}</span>
                                        </div>
                                        <p className="dark:text-gray-300 text-gray-500">
                                            {updateContent(message)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Chọn một cuộc hội thoại để xem chi tiết</p>
                        </div>
                    )}
                </ComponentCard>
            </div>
        </>
    );
}

export default ChatListOverview;