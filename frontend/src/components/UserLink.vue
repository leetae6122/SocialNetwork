<template>
    <!-- <div class="loading">
        <div aria-hidden="true">
            <div class="placeholder-wave">
                <span class="img placeholder"></span>
            </div>
        </div>
    </div> -->
    <div class="d-flex rounded-sm my-1 px-2">
        <!-- Avatar -->
        <div class="position-relative">
            <router-link :to="{
                name: 'user.posts',
                params: { id: this.userid }

            }">
                <img :src="this.user.avatar?.avatar_data" class="avatarUser" alt="Avatar User">
            </router-link>
            <div v-if="showStatus">
                <span v-if="this.user.online"
                    class="position-absolute user-status translate-middle bg-success rounded-circle">
                    <span class="visually-hidden">Online</span>
                </span>
                <span v-else class="position-absolute user-status translate-middle bg-secondary rounded-circle">
                    <span class="visually-hidden">Offline</span>
                </span>
            </div>
        </div>
        <!-- User -->
        <div class="my-auto" v-if="showName">
            <div v-if="showPopper">
                <Popper class="light" hover>
                    <router-link class="fs-6 px-2" :to="{
                        name: 'user.posts',
                        params: { id: this.userid }
                    }">
                        {{ this.user.name?.fullname }}
                        <span class="fst-italic fw-light">
                            <slot></slot>
                        </span>
                    </router-link>
                    <template #content>
                        <div class="" style="width: 200px;">
                            <profile-card :user="user" :showDetail="false"> </profile-card>
                        </div>
                    </template>
                </Popper>
            </div>

            <div v-else>
                <router-link class="fs-6 px-2" :to="{
                    name: 'user.posts',
                    params: { id: this.userid }
                }">
                    {{ this.user.name?.fullname }}
                    <span class="fst-italic fw-light">
                        <slot></slot>
                    </span>
                </router-link>
            </div>
        </div>

    </div>
</template>
<script>
import UserService from "@/services/user.service";

import Popper from "vue3-popper";
import ProfileCard from "@/components/profile/ProfileCard.vue";
export default {
    components: {
        Popper, ProfileCard
    },
    props: {
        userid: { type: String, required: true },
        showName: { type: Boolean, default: true },
        showStatus: { type: Boolean, default: true },
        showPopper: { type: Boolean, default: true },
    },
    data() {
        return {
            user: [],
        }
    },
    methods: {
        async getUser(id) {
            this.user = await UserService.getOne(id);
        },
    },
    created() {
        this.getUser(this.userid);
    },

}

</script>
<style scoped>
.img {
    height: 40px;
    width: 40px;
    border-radius: 100%;
}

.avatarUser {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    border: 1px solid rgba(0, 0, 0, 0.5);
}

a {
    font-size: 1.2rem;
    font-weight: 500;
}

span {
    color: black;
}

.user-status {
    top: 85%;
    left: 85%;
    padding: 0.3rem;
    border: 1px solid white;
}
</style>