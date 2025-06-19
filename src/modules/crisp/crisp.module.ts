export enum SentimentStatus {
    POSITIVE = 'POSITIVE',
    NEUTRAL= 'NEUTRAL',
    NEGATIVE = 'NEGATIVE',
    NONE = 'NONE'
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
    conversatioNickname: string | null;
    metaData: CrispMetaData[];
}

export interface CrispWebsiteResponse {
    id: string;
    createdAt: string;
    updatedAt?: string;
    websiteId: string;
    websiteName?: string;
    websiteUrl?: string;
}

export interface CrispConfigResponse {
    id: string;
    createdAt: string;
    updatedAt?: string;
    crispTokenIdentifier: string;
    crispTokenKey: string;
    websites?: CrispWebsiteResponse[]
}

export interface CrispKeyPayload {
    crispTokenIdentifier: string;
    crispTokenKey: string;
}

export interface CrispWebsitePayload {
    name: string;
    domain: string;
    websiteId: string;
}