import createApiClient from "./apiJWT.service";
import { useAuthStore } from '@/stores/store';

class UserService {
    constructor(baseUrl = "/api/users") {
        this.api = createApiClient(baseUrl);
        // console.log(this.api);
    }

    async getUsers() {
        const authStore = useAuthStore();
        const res =await this.api.get(('/'),{
            headers:{Authorization:`Bearer ${authStore.token}`},
        });
        return res.data;
    }

    async getUserByName(name) {
        const authStore = useAuthStore();
        const res =await this.api.get(('/'),{
            headers:{Authorization:`Bearer ${authStore.token}`},
            params:{name:name}
        });
        return res.data;
    }
    
    async getUserByFriendList(name) {
        const authStore = useAuthStore();
        const res =await this.api.get(('/friends'),{
            headers:{Authorization:`Bearer ${authStore.token}`},
            params:{name:name}
        });
        return res.data;
    }

    async getOne(id) {
        const authStore = useAuthStore();
        const res =await this.api.get((`/${id}`),{
            headers:{Authorization:`Bearer ${authStore.token}`}
        });
        return res.data;
    }

    async getFriendList() {
        const authStore = useAuthStore();
        const res =await this.api.get(('/friends'),{
            headers:{Authorization:`Bearer ${authStore.token}`}
        });
        return res.data;
    }

    async getFriendListOfUser(id) {
        const authStore = useAuthStore();
        const res =await this.api.get((`/friends/${id}`),{
            headers:{Authorization:`Bearer ${authStore.token}`}
        });
        return res.data;
    }

    async updateUser(id, data) {
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
    
    async logOut() {
        const authStore = useAuthStore();
        await this.api.get(("/logout"),{
            headers:{Authorization:`Bearer ${authStore.token}`}
        });
    }

    async addFriend(data){
        const authStore = useAuthStore();
        await this.api.put(("/addfriend"),data,{
            headers:{Authorization:`Bearer ${authStore.token}`}
        });
    }

    async unFriend(id){
        const authStore = useAuthStore();
        const data={
            userid : id
        }
        await this.api.put(("/unfriend"),data,{
            headers:{Authorization:`Bearer ${authStore.token}`}
        });
    }

}

export default new UserService();