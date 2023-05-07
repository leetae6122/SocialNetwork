import createApiClient from "./api.service";
import { useAuthStore } from '@/stores/store';

class NewsService {
    constructor(baseUrl = "/api/news") {
        this.api = createApiClient(baseUrl);
        // console.log(this.api);
    }
    async getAll() {
        const authStore = useAuthStore();
        const res = await this.api.get(('/'), {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        return res.data;
    }
    async getOne(id) {
        const authStore = useAuthStore();
        const res = await this.api.get((`/${id}`), {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        return res.data;
    }
    async deleteNews(id) {
        const authStore = useAuthStore();
        const res = await this.api.delete((`/${id}`), {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        return res.data;
    }

    async updateReadedNews(id) {
        const authStore = useAuthStore();
        const data = {
            readed: true
        };
        const res = await this.api.post(`/${id}`,data ,{
            headers: { Authorization: `Bearer ${authStore.token}`, },
        })
        return res.data;
    }

    async updateConfirmNews(id) {
        const authStore = useAuthStore();
        const data = {
            confirm: true
        };
        const res = await this.api.put(`/${id}`,data ,{
            headers: { Authorization: `Bearer ${authStore.token}`, },
        })
        return res.data;
    }

    async createNewsAddFriend(receive) {
        const authStore = useAuthStore();
        const data = {
            _receiveUid: receive,
            _sendUid: authStore.userid,
            add_friend:true
        };
        const res = await this.api.post('/send',data ,{
            headers: { Authorization: `Bearer ${authStore.token}`, },
        })
        return res.data;
    }
}

export default new NewsService();