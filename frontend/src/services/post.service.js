import { useAuthStore } from '@/stores/store';
import createApiClient from "./apiJWT.service";

class PostService {
    constructor(baseUrl = "/api/posts") {
        this.api = createApiClient(baseUrl);
        // console.log(this.api);
    }

    async postAll() {
        const authStore = useAuthStore();
        const res = await this.api.get("/", {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        return res.data;
    }
    async postAll(userid) {
        const authStore = useAuthStore();
        const res = await this.api.get("/", {
            headers: { Authorization: `Bearer ${authStore.token}` },
            params:{uid:userid}
        })
        return res.data;
    }

    async postOne(id) {
        const authStore = useAuthStore();
        const res = await this.api.get(`/${id}`, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        })
        return res.data;
    }

    async postUser(userid) {
        const authStore = useAuthStore();
        const res = await this.api.get("/", {
            headers: { Authorization: `Bearer ${authStore.token}` },
            params:{id:userid}
        })
        return res.data;
    }

    async getFavoritedPosts() {
        const authStore = useAuthStore();
        const res = await this.api.get("/favorite", {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        return res.data;
    }

    async createPost(data) {
        const authStore = useAuthStore();
        const res = await this.api.post("/", data, {
            headers: {
                Authorization: `Bearer ${authStore.token}`,
                "Content-Type": "multipart/form-data",
                Accept: "multipart/form-data",
            }
        })
        return res.data;
    }

    async updatePost(id, data) {
        const authStore = useAuthStore();
        const res = await this.api.put(`/${id}`, data, {
            headers: {
                Authorization: `Bearer ${authStore.token}`,
                "Content-Type": "multipart/form-data",
                Accept: "multipart/form-data",
            }
        })
        return res.data;
    }

    async deletePost(id) {
        const authStore = useAuthStore();
        const res = await this.api.delete((`/${id}`),{
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        return res.data;
    }

    async pressUnfavorite(id) {
        const authStore = useAuthStore();
        const data ={id: id};
        const res = await this.api.put(('/unfavorite'),data ,{
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        return res.data;
    }

    async pressFavorite(id) {
        const authStore = useAuthStore();
        const data ={id: id};
        const res = await this.api.put(('/favorite'),data ,{
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        return res.data;
    }

}

export default new PostService();