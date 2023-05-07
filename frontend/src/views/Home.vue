<template>
    <div class="row">
        <div class="col-lg-2"></div>
        <div class="col-lg-8 col-sm-12">
            <CreatePost></CreatePost>
            <div v-if="filteredPostsCount > 0">
                <PostCard v-for="(post, index) in this.postStore.posts" :key="post._id" :post="post" />
            </div>
            <div v-else class="text-center card">
                <h1 class="my-auto text-decoration-underline text-bg-warning bg-opacity-75 rounded-3 h-100">
                    No posts
                </h1>
            </div>
        </div>
        <div class="col-lg-2"></div>
    </div>
</template>
<script>
import PostService from "@/services/post.service";
import UserService from "@/services/user.service";

import ContactList from "@/components/ContactList.vue";
import PostCard from "@/components/post/PostCard.vue";
import CreatePost from "@/components/post/CreatePost.vue";
import { usePostStore } from '@/stores/store';
export default {
    components: {
        ContactList,
        PostCard,
        CreatePost
    },
    data() {
        return {
            postStore: usePostStore(),
            contacts: [],
        };
    },
    computed: {
        filteredPostsCount() {
            return this.postStore.posts.length;
        },

        filteredContactsCount() {
            return this.contacts.length;
        },
    },
    methods: {
        async postAll() {
            const posts = await PostService.postAll();
            await this.postStore.savePost(posts);
        },
        async getContacts() {
            this.contacts = await UserService.getFriendList();
        },
    },
    created() {
        this.postAll();
        this.getContacts();
    },
}
</script>
<style scoped>
.bar-fixed {
    position: fixed;
}

[v-cloak] {
    display: none;
}
</style>