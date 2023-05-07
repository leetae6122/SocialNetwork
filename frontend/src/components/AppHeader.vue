<template>
    <nav class="navbar bg-white sticky-top row">
        <!-- Logo -->
        <div class="col-3 col-lg-2 mx-2 text-end">
            <a href="/">
                <img src="@/assets/logo.png" class="logo rounded-circle" alt="Life">
            </a>
        </div>
        <div v-if="!this.authStore.login" class="headerNoLogin col-7 col-lg-8 mx-8">
            <h4> LIFE Social NetWork</h4>
        </div>
        <!-- Search -->
        <div class="col-8 col-lg-3 mx-2" v-if="this.authStore.login">
            <input-search @submit:search="friendSearch" />
        </div>
        <!-- Navigation -->
        <div class="col-8 col-lg-2 row mx-1" v-if="this.authStore.login">
            <div class="my-auto col-4">
                <Popper class="dark" arrow hover content="Home">
                    <router-link class="btn btn-outline-primary mx-1"
                        :class="[($route.name == 'home') ? { active: true } : '']" :to="{ name: 'home' }">
                        <i class="fa-solid fa-house"></i>
                    </router-link>
                </Popper>
            </div>
            <div class="my-auto col-4">
                <Popper class="dark" arrow hover content="Messages">
                    <router-link class="btn btn-outline-primary mx-1"
                        :class="[($route.name == 'messages') ? { active: true } : '']" :to="{ name: 'messages' }">
                        <i class="fa-solid fa-comment-dots"></i>
                    </router-link>
                </Popper>
            </div>
            <div class="my-auto col-4">
                <Popper class="dark" arrow hover content="Friends">
                    <router-link class="btn btn-outline-primary mx-1"
                        :class="[($route.matched[0]?.path == '/friends') ? { active: true } : '']"
                        :to="{ name: 'friends' }">
                        <i class="fa-solid fa-user-group"></i>
                    </router-link>
                </Popper>
            </div>
        </div>
        <!-- Notifications -->
        <div class="col-3 col-lg-3 mx-1 d-flex" v-if="this.authStore.login">
            <div class="my-auto">
                <div class="dropdown text-center">
                    <button class="btn btn-light rounded-circle position-relative" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <Popper class="dark" hover content="Notifications">
                            <i class="fa-solid fa-bell"></i>
                        </Popper>
                        <span class="position-absolute translate-middle badge rounded-pill bg-danger">
                            {{ (count != null && count > 0) ? count : '' }}
                        </span>
                    </button>
                    <!-- Show Notifications -->
                    <ul class="dropdown-menu mt-0">
                        <li v-for="(itemNews, index) in news" :key="itemNews._id" style="width: max-content;" class="my-1">
                            <Notification :id="itemNews._id" />
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Account -->
            <div class="dropdown text-center">
                <button class="btn border-0" data-bs-toggle="dropdown" aria-expanded="false">
                    <user-link :userid="this.authStore.userid" :showName="false" :showStatus="false" />
                </button>
                <ul class="dropdown-menu m-0">
                    <li>
                        <router-link class="btn dropdown-item" :to="{
                            name: 'user.posts',
                            params: { id: this.authStore.userid }
                        }">
                            <i class="fa-solid fa-circle-user"></i> Profile
                        </router-link>
                    </li>
                    <li>
                        <button class="btn dropdown-item" @click="logout">
                            <i class="fa-solid fa-right-from-bracket"></i> Log Out
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
import UserLink from '@/components/UserLink.vue';
import InputSearch from '@/components/InputSearch.vue';
import Notification from '@/components/Notification.vue';

import UserService from "@/services/user.service";
import NewsService from "@/services/news.service";
import { useAuthStore } from '@/stores/store';
import Popper from "vue3-popper";

export default {
    components: {
        UserLink, Popper, InputSearch, Notification
    },
    data() {
        return {
            authStore: useAuthStore(),
            news: [],
            count: null,
        }
    },
    methods: {
        async logout() {
            await UserService.logOut();
            await this.authStore.logOut();
            this.$router.go();
        },
        async getAllNews() {
            if (this.authStore.login)
                this.news = await NewsService.getAll();
            this.countNews();
        },
        friendSearch(text) {
            this.$router.push({
                name: "friends.search",
                params: { search: text }
            })
        },
        async countNews() {
            for (const iterator of this.news) {
                if (iterator.readed == false) {
                    this.count += 1;
                }
            }
        }
    },
    created() {
        this.getAllNews();
    }
}
</script>
<style scoped>
.badge {
    top: 10% !important;
    left: 80%;
    font-size: 0.65rem;
}

.dropdown-menu[data-bs-popper] {
    right: 30%;
    left: unset;
}

.logo {
    width: 55px;
}

.fixedCenter {
    position: absolute;
    right: 40%;
    z-index: 1;
}

ul li {
    margin: 2px;
}

nav {
    height: fit-content;
    border: 1px solid rgb(210, 210, 210);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
}

i {
    font-size: 1.2rem;
    padding: 2px;
    color: #007bff;
}

.headerNoLogin {
    font-size: 2rem;
    color: blue;
    text-shadow: 2px 2px 5px #007BFF;
}

.btn-outline-primary {
    border: 0;
}

.btn-outline-primary:hover i {
    color: white;
}

.btn-outline-primary.active i {
    color: white;
}

.btn-outline-light {
    border: 0;
    color: #007bff;
}
</style>