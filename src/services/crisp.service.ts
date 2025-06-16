import { ConversationResponse } from '@/modules/crisp/crisp.module';
import BaseAPI from './base.service';

const PATH_URL = `api/crisp`;

// Get all conversation
const getAllConversationRequest = async () => {
    return BaseAPI.GET<ConversationResponse[]>(`${PATH_URL}/conversation`);
}

const CrispService = {
    getAllConversationRequest,
};

export default CrispService;