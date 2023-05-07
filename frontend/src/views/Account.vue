<template>
    <div class="bg-img">
        <div class="card mx-auto">
            <auth-form :auth="auth" @submit:auth="login">
                Log In
            </auth-form>
            <div class="card-footer">
                <button type="button" class="btn btn-success w-100" data-bs-toggle="modal" data-bs-target="#registerModal">
                    <i class="fa-solid fa-circle-plus"></i>
                    Register
                </button>
            </div>
        </div>
        <p class="text-white font-weight-bolder">Life Social Network &copy; 2023. Developed by Tri</p>

        <!-- Modal -->
        <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <user-form :user="user" @submit:user="register" modalLabels="registerModalLabel">
                        Register
                    </user-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AuthForm from "@/components/account/AuthForm.vue";
import UserForm from "@/components/account/UserForm.vue";
import AuthService from "@/services/auth.service";
import { useAuthStore } from '@/stores/store';

export default {
    components: {
        AuthForm, UserForm
    },

    data() {
        return {
            auth: {},
            user: {},
            authStore: useAuthStore()
        };
    },
    computed: {
        
    },
    methods: {
        async login(data) {
            try {
                const response = await AuthService.login(data);
                if (response) {
                    await this.authStore.logIn(response);
                    this.$router.push({ name: "home" });
                }
            } catch (error) {
                alert(error.response.data.message)
            }
        },
        async register(data) {
            try {
                await AuthService.register(data);
                this.$router.go();
            } catch (error) {
                alert(error.response.data.message)
            }
        },
    },
    created() {
        this.auth = { username: null, password: null }
        this.user = {}
    }
}
</script>
<style scoped>
/*  Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
    .card {
        width: 450px;
    }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
    .card {
        width: 600px;
    }
}

.bg-img {
    background-image: url("@/assets/background.jpg");
    background-size: cover;
    padding: 50px;
    border-radius: 5px;
    height: 100%;
}
</style>