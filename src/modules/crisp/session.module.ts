import {SentimentStatus} from "@/modules/crisp/crisp.module";

export interface MessageUser {
    user_id: string;
    nickname: string;
}

export interface SessionResponse {
    id: string;
    createdAt: string;
    updatedAt?: string;
    sessionId: string;
    meta: {
        ip: string;
        email: string;
        phone: string;
        avatar: string;
        nickname: string;
        segments: string[];
    };
    compose: {
        operator: {
            [userId: string]: {
                type: string;
                user: MessageUser;
                timestamp: number;
            };
        };
    };
    state: string;
    lastMessage: string;
    assigned: {
        user_id: string;
    };
    sentiment: SentimentStatus | null;
    topic?: string;
}

export interface MessageResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    websiteId: string;
    fingerprint: string;
    type: string;
    from: string;
    origin: string;
    content: string | { [key: string]: any };
    user: MessageUser | null;
    preview: any[];
    mentions: any[];
    read: string;
    delivered: string;
    stamped: boolean;
    timestamp: string;
}

export interface BlockResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    key: string;
    topic?: string;
    sentiment: string | null;
    priority: number;
    messages: MessageResponse[];
}
