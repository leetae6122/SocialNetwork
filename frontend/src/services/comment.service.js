import createApiClient from "./apiJWT.service";
import { useAuthStore } from '@/stores/store';

class CommetService {
    constructor(baseUrl = "/api/comments") {
        this.api = createApiClient(baseUrl);
        // console.log(this.api);
    }
    
    async getPostComments(id) {
        const authStore = useAuthStore();
        const res =await this.api.get(`/post/${id}`,{
            headers:{Authorization:`Bearer ${authStore.token}`}
        })
        return  res.data;
    }

    async deleteComment(id) {
        const authStore = useAuthStore();
        const res =await this.api.delete(`/${id}`,{
            headers:{Authorization:`Bearer ${authStore.token}`}
        })
        return  res.data;
    }

    async createPostComments(id, text) {
        const authStore = useAuthStore();
        const data = {
            content: text,
        }
        const res =await this.api.post(`/post/${id}`,data,{
            headers:{Authorization:`Bearer ${authStore.token}`}
        })
        return  res.data;
    }

}

export default new CommetService();