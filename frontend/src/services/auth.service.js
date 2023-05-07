import createApiClient from "./api.service";

class AuthService {
    constructor(baseUrl = "/api/auth") {
        this.api = createApiClient(baseUrl);
        // console.log(this.api);
    }
    async login(data) {
        return (await this.api.post("/login", data)).data;
    }
    async register(data) {
        return (await this.api.post("/register", data)).data;
    }
    async refreshToken() {
        const res = await this.api.post(('/refresh'), {
            withCredentials: true
        });
        return res.data;

    }
}

export default new AuthService();