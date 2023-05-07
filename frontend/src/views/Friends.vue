<template>
    <div class="row">
        <ul class="list-group col-lg-3 col-12 h-100">
            <li class="list-group-item">
                <router-link class="btn btn-outline-primary w-100 fs-5 active" :to="{ name: 'friends' }">
                    <i class="fa-solid fa-house"></i> Home
                </router-link>
            </li>
            <li class="list-group-item">
                <router-link class="btn btn-outline-primary w-100 fs-5" :to="{ name: 'friends.requests' }">
                    <i class="fa-solid fa-user-check"></i> Friend requests
                </router-link>
            </li>
            <li class="list-group-item">
                <router-link class="btn btn-outline-primary w-100 fs-5" :to="{ name: 'friends.list' }">
                    <i class="fa-solid fa-users"></i> All Friends
                </router-link>
            </li>
        </ul>
        <div class="col-lg-9 col-12 my-2">
            <div class="row">
                <div v-for="(user, index) in users" class="col-lg-3 col-md-4 col-6 p-1">
                    <ProfileCard :user="user" :showDetail="false" :key="user._id" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ProfileCard from "@/components/profile/ProfileCard.vue";
import UserService from "@/services/user.service";
import { useAuthStore } from '@/stores/store';
export default {
    components: {
        ProfileCard
    },
    data() {
        return {
            authStore: useAuthStore(),
            users: [],
        }
    },
    methods: {
        async getUsers() {
            const usersList = await UserService.getUsers();
            const friendList = await UserService.getFriendList();

            for (let i = 0; i < usersList.length; i++) {
                for (const item of friendList) {
                    if (usersList[i]._id == item._id) {
                        usersList.splice(i, 1);
                    }
                }
            }
            for (let i = 0; i < usersList.length; i++) {
                if (usersList[i]._id == this.authStore.userid) {
                    usersList.splice(i, 1);
                }
            }
            this.users = usersList;
        },

    },
    created() {
        this.getUsers();
    }

}
</script>

<style scoped>
.list-group-item,
.btn-outline-primary {
    border: none;
}
</style>