import axios from "axios";
import { useAuthStore } from '@/stores/store';
import jwt_decode from "jwt-decode";
import AuthService from "@/services/auth.service";

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },

};

export default (baseURL) => {
    // console.log(baseURL);
    const instance = axios.create({
        baseURL,
        ...commonConfig,
    });
    instance.interceptors.request.use(async (config) => {
        const authStore = useAuthStore();
        const decodeToken = jwt_decode(authStore.token);
        const date = new Date();
        if (decodeToken.exp < date.getTime() / 1000) {
            try {
                const data = await AuthService.refreshToken();
                await authStore.logIn(data);
                config.headers["Authorization"] = "Bearer " + data.AccessToken;
            } catch (error) {
                await authStore.logOut();
                location.reload();
            }
        }
        return config;
    })
    return instance;
};

