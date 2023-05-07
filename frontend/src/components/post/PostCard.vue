<template>
    <div class="card mt-2">
        <!-- Header -->
        <div class="card-header d-flex justify-content-between">
            <div class="d-flex ml-3">
                <user-link :userid="this.post._uid" :showStatus="false" />
                <div class="my-auto">
                    <TimeAgo :date_create="this.post?.date_created" :changed="this.post.changed" />
                </div>
            </div>
            <!-- Setting -->
            <div class="my-auto mr-3">
                <div class="dropdown-center" v-if="this.post._uid == this.authStore.userid">
                    <a class="btn btn-outline-primary rounded-circle border-0" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <button class="dropdown-item" data-bs-toggle="modal"
                                :data-bs-target="'#updatePostModal' + this.post._id">
                                Edit
                            </button>
                        </li>
                        <li>
                            <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#deletePostModal">
                                Delete
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- Body -->
        <div class="card-body">
            <p v-if=(this.post.title) class="fw-bold fs-5">{{ this.post.title }}</p>
            <p v-if=(this.post.content)>{{ this.post.content }}</p>
            <div v-if=(this.post.image)>
                <div class="row justify-content-center">
                    <img :src="this.post.image.img_data" alt="" class="col-12">
                </div>
            </div>
            <div style="font-size: 0.85rem;">
                <i class="fa-solid fa-heart text-danger mx-1">{{ " " + numberFavorite }}</i>
                <i class="fa-solid fa-message text-primary mx-1">{{ " " + commentsCount }}</i>
            </div>
        </div>
        <!-- Footer -->
        <div class="card-footer">
            <div class="row footerPost">
                <div class="col-6" v-if="this.favoritePosts.length != 0">
                    <handle-favorite :postid="this.post._id" v-model="numberFavorite" :favoritePosts="this.favoritePosts" />
                </div>
                <div class="col-6">
                    <router-link class="btn btn-outline-primary border-0 w-100" :to="{
                        name: 'post.comments',
                        params: { id: this.post._id }
                    }">
                        <i class="fa-solid fa-comments"></i><span class="fw-bold">Comments</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Delete -->
    <div class="modal fade" id="deletePostModal" tabindex="-1" aria-labelledby="deletePostModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deletePostModalLabel">Notification</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Do you want to delete this post?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" @click="deletePost(this.post._id)"
                        data-bs-dismiss="modal">Delete</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Edit Post -->
    <div class="modal fade" :id="'updatePostModal' + this.post._id" aria-labelledby="updatePostModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <post-form :post="this.post" @submit:post="updatePost" modalLabels="updatePostModalLabel">
                    Edit post
                </post-form>
            </div>
        </div>
    </div>
</template>
<script>
import UserLink from '@/components/UserLink.vue';
import TimeAgo from "@/components/TimeAgo.vue";
import HandleFavorite from "@/components/HandleFavorite.vue";
import PostForm from "@/components/post/PostForm.vue";

import PostService from "@/services/post.service";
import { useAuthStore, useCommentStore, usePostStore } from '@/stores/store';
export default {
    components: {
        UserLink, TimeAgo, HandleFavorite, PostForm
    },
    data() {
        return {
            authStore: useAuthStore(),
            commentStore: useCommentStore(),
            postStore: usePostStore(),
            favoritePosts: [],
            numberFavorite: 0
        }
    },
    computed: {
        commentsCount() {
            return this.commentStore.comments.length;
        },
    },
    props: {
        post: { type: Object, required: true }
    },
    methods: {
        async deletePost(postid) {
            await PostService.deletePost(postid);
            const posts = await PostService.postAll();
            await this.postStore.savePost(posts);
            if (this.$route.name == 'post.comments')
                this.$router.go(-1)
        },
        async updatePost(data) {
            await PostService.updatePost(this.post._id, data);
        },
        async getFavoritedPosts() {
            this.favoritePosts = await PostService.getFavoritedPosts();
        },
        favoritesCount() {
            if (this.post.favorites_list)
                this.numberFavorite = (this.post.favorites_list).length;
        },
    },
    created() {
        this.getFavoritedPosts();
        this.favoritesCount();
    }
}
</script>
<style scoped>
.dropdown-menu {
    --bs-dropdown-min-width: fit-content;
}

img {
    width: 500px;
}
</style>
