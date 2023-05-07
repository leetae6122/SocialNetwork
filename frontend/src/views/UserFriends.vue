<template>
    <div class="row">
        <profile-card v-for="(user, index) in users" :key="user._id" :user="user" class="col-lg-3 col-md-4 col-6" />
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
        id: { type: String, required: true },
    },
    data() {
        return {
            users: []
        }
    },
    methods: {
        async getFriendList() {
            this.users = await UserService.getFriendListOfUser(this.id);
        },
    },
    created() {
        this.getFriendList();
    }

}

</script>
<style scoped>
.bar-fixed {
    margin-top: 0;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
}

.btn-outline-light {
    border: 0;
    color: rgba(0, 0, 0);
    font-weight: bold;
}

.btn-outline-light:hover {
    color: #007BFF;
}

.active {
    background: none;
    border-bottom: 3px solid #007BFF;
    border-radius: 0;
}
</style>