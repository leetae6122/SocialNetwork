<template>
    <div class="d-flex rounded-sm my-1 px-2">
        <!-- Avatar -->
        <div class="position-relative">
            <router-link :to="{
                name: 'user.posts',
                params: { id: this.userid }

            }">
                <img :src="this.user.avatar?.avatar_data" class="avatarUser" alt="Avatar User">
            </router-link>
            <span v-if="this.user.online" class="position-absolute user-status translate-middle bg-success rounded-circle">
                <span class="visually-hidden">Online</span>
            </span>
            <span v-else class="position-absolute user-status translate-middle bg-secondary rounded-circle">
                <span class="visually-hidden">Offline</span>
            </span>
        </div>
        <div v-if="isLink" class="mx-2 my-auto">
            <router-link class="fw-bold" :to="{
                name: 'messages'
            }">
                {{ this.user.name?.fullname }}
            </router-link>
        </div>
       
    </div>
</template>
<script>
import UserService from "@/services/user.service";

export default {
    props: {
        userid: { type: String, required: true },
        isLink: { type: Boolean, default: true },
        index: { type: Number, default: -1 }
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