<template>
    <div class="row">
        <ul class="list-group col-lg-3 col-12 h-100">
            <li class="list-group-item">
                <router-link class="btn btn-outline-primary w-100 fs-5" :to="{ name: 'friends' }">
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
            <div class="row" v-if="filteredUsersCount > 0">
                <div v-for="(user, index) in users" class="col-lg-3 col-md-4 col-6 p-1">
                    <profile-card :user="user" :showDetail="false" :key="user._id" />
                </div>
            </div>
            <div v-else>
                <h1 class="my-auto p-5 text-decoration-underline text-center text-bg-warning bg-opacity-75 rounded-3">
                    No contact
                </h1>
            </div>
        </div>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
import ProfileCard from "@/components/profile/ProfileCard.vue";

export default {
    components: {
        ProfileCard
    },
    props: {
        search: { type: String, default: null }
    },
    data() {
        return {
            users: []
        }
    },
    computed: {
        filteredUsersCount() {
            return this.users.length;
        },
    },
    methods: {
        async getUsersSearch() {
            this.users = await UserService.getUserByName(this.search);
        },
    },
    created() {
        this.getUsersSearch();
    }

}
</script>
<style scoped>
.list-group-item,
.btn-outline-primary {
    border: none;
}

.avatarUser {
    width: 150px;
    height: 150px;
}
</style>