import {
    CrispConfigResponse,
    CrispKeyPayload,
    CrispWebsitePayload, CrispWebsiteResponse
} from '@/modules/crisp/crisp.module';
import BaseAPI from './base.service';
import {PaginatedResponse} from "@/modules/api/utils.module";
import {BlockResponse, BlockSearchPayload, SessionResponse} from '@/modules/crisp/session.module';

const PATH_URL = `api/crisp`;

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

// Get all Session
const getAllSessions = async (page: number = 1, limit: number = 10, search: BlockSearchPayload) => {
    return BaseAPI.GET<PaginatedResponse<SessionResponse[]>>(`${PATH_URL}/session/all/${page}/${limit}`, search);
}

// Get all Block
const getAllBlocks = async (sessionId: string, page: number = 1, limit: number = 10) => {
    return BaseAPI.GET<PaginatedResponse<BlockResponse[]>>(`${PATH_URL}/block/all/${sessionId}/${page}/${limit}`);
}


const CrispService = {
    getAllCrisp,
    createSetKey,
    createSetWebsite,
    getAllSessions,
    getAllBlocks
};

export default CrispService;