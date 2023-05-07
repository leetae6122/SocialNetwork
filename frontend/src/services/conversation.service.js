import createApiClient from "./apiJWT.service";
import { useAuthStore } from '@/stores/store';

class ConversationService {
    constructor(baseUrl = "/api/conversations") {
        this.api = createApiClient(baseUrl);
    }
    
    async getConversation(userId) {
        const authStore = useAuthStore();
        const res =await this.api.get(`/${userId}`,{
            headers:{Authorization:`Bearer ${authStore.token}`}
        });
        return  res.data;
    }

    async createConversation(senderId, receiverId) {
        const authStore = useAuthStore();
        const data = {
            senderId: senderId,
            receiverId: receiverId
        }
        const res =await this.api.post('/',data,{
            headers:{Authorization:`Bearer ${authStore.token}`}
        })
        return  res.data;
    }

}

export default new ConversationService();