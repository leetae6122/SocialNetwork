<template>
    <div class="row">
        <div class="col-lg-4 col-12">
            <profile-card class="bar-fixed" :user="user" />
        </div>
        <div class="col-lg-8 col-12">
            <create-post v-if="this.authStore.userid == this.id"></create-post>
            <div v-if="filteredPostsCount > 0">
                <post-card v-for="(post, index) in posts" :post="post" :key="post._id" />
            </div>
            <div v-else class="text-center card h-100">
                <h1 class="my-auto text-decoration-underline text-bg-warning bg-opacity-75 rounded-3">
                    No posts
                </h1>
            </div>
        </div>

    </div>
</template>
<script>
import PostService from "@/services/post.service";
import UserService from "@/services/user.service";

import PostCard from "@/components/post/PostCard.vue";
import ProfileCard from "@/components/profile/ProfileCard.vue";
import CreatePost from "@/components/post/CreatePost.vue";
import { useAuthStore } from '@/stores/store';
export default {
    components: {
        PostCard, ProfileCard, CreatePost
    },
    data() {
        return {
            authStore: useAuthStore(),
            posts: [],
            user: {},
        };
    },
    props: {
        id: { type: String, required: true },
    },
    computed: {
        filteredPostsCount() {
            return this.posts.length;
        },
    },
    methods: {
        async postAll() {
            this.posts = await PostService.postAll(this.id);
        },
        async getUser(userId) {
            this.user = await UserService.getOne(userId);
        },
    },
    created() {
        this.postAll();
        this.getUser(this.id);
    },
}

</script>
<style scoped>
.bar-fixed {
    margin-top: 0;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
}
</style>