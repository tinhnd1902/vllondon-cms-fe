export enum SentimentStatus {
    POSITIVE,
    NEUTRAL,
    NEGATIVE,
    NONE = "none"
}

export enum ConversationForm {
    USER = "user",
    OPERATOR = "operator",
}

export enum ConversationType {
    TEXT = "text",
    FILE = "file"
}

export interface CrispMetaDataUser {
    user_id?: string;
    nickname: string;
    avatar?: string;
}

export interface CrispMetaDataContent {
    url?: string;
    name?: string;
    type?: string;
    namespace?: string;
}

export interface CrispMetaData {
    from: ConversationForm;
    read: string;
    type: ConversationType;
    user?: CrispMetaDataUser;
    origin: string;
    content: string | CrispMetaDataContent;
    preview: any[];
    stamped: boolean;
    mentions: any[];
    delivered: string;
    timestamp: number;
    session_id: string;
    website_id: string;
    fingerprint: number;
    ignored?: {
        email: {
            type: string;
            reason: string;
        }
    };
}

export interface ConversationResponse {
    id: string;
    createdAt: string;
    updatedAt?: string;
    createrId: string;
    websiteId: string;
    sessionId: string;
    sentiment: SentimentStatus | null;
    conversationTopic: string | null;
    metaData: CrispMetaData[];
}