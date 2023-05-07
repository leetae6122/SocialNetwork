import createApiClient from "./apiJWT.service";
import { useAuthStore } from '@/stores/store';

class MessageService {
    constructor(baseUrl = "/api/messages") {
        this.api = createApiClient(baseUrl);
    }
    
    async getMessages(conversationId) {
        const authStore = useAuthStore();
        const res =await this.api.get(`/${conversationId}`,{
            headers:{Authorization:`Bearer ${authStore.token}`}
        })
        return  res.data;
    }

    async createMessage(data) {
        const authStore = useAuthStore();
        const res =await this.api.post('/',data,{
            headers:{Authorization:`Bearer ${authStore.token}`}
        })
        return  res.data;
    }

    async deleteMessage(id) {
        const authStore = useAuthStore();
        const res =await this.api.delete(`/${id}`,{
            headers:{Authorization:`Bearer ${authStore.token}`}
        })
        return  res.data;
    }

}

export default new MessageService();