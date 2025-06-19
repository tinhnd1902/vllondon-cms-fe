import {
    ConversationResponse,
    CrispConfigResponse,
    CrispKeyPayload,
    CrispWebsitePayload, CrispWebsiteResponse
} from '@/modules/crisp/crisp.module';
import BaseAPI from './base.service';
import {PaginatedResponse} from "@/modules/api/utils.module";

const PATH_URL = `api/crisp`;

// Get all conversation
const getAllConversation = async () => {
    return BaseAPI.GET<ConversationResponse[]>(`${PATH_URL}/conversation`);
}

// Get all Crisp
const getAllCrisp = async (page: number = 1, limit: number = 10) => {
    return BaseAPI.GET<PaginatedResponse<CrispConfigResponse[]>>(`${PATH_URL}/all/${page}/${limit}`);
}

// Create set-key
const createSetKey = async (payload: CrispKeyPayload) => {
    return BaseAPI.POST<CrispConfigResponse>(`${PATH_URL}/set-key`, payload);
}

// Create set-website
const createSetWebsite = async (keyPair: string, payload: CrispWebsitePayload) => {
    return BaseAPI.POST<CrispWebsiteResponse>(`${PATH_URL}/set-website/${keyPair}`, payload);
}

const CrispService = {
    getAllConversation,
    getAllCrisp,
    createSetKey,
    createSetWebsite
};

export default CrispService;