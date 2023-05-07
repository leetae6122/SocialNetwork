<template>
    <div class="card">
        <div class="row justify-content-around" style="height: 65px;">
            <div class="col-1 my-auto">
                <user-link :userid="this.authStore.userid" :showName="false" :showStatus="false"></user-link>
            </div>
            <div class="col-10 my-auto">
                <button class="btn btn-outline-dark text-left rounded-pill w-100" data-bs-toggle="modal"
                    data-bs-target="#createPostModal">
                    Create a new post
                </button>
            </div>
        </div>
    </div>
    <!-- Modal Create Post -->
    <div class="modal fade" id="createPostModal" tabindex="-1" aria-labelledby="createPostModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <post-form :post="newPost" @submit:post="createNewPost" modalLabels="createPostModalLabel">
                    Create post
                </post-form>
            </div>
        </div>
    </div>
</template>
<script>
import PostService from "@/services/post.service";

import UserLink from '@/components/UserLink.vue';
import PostForm from "@/components/post/PostForm.vue";
import { useAuthStore, usePostStore } from '@/stores/store';
export default {
    components:{
        UserLink,PostForm
    },
    data(){
        return{
            authStore: useAuthStore(),
            postStore: usePostStore(),
            newPost: {},
        }
    },
    methods:{
        async createNewPost(data) {
            await PostService.createPost(data);
            const posts = await PostService.postAll();
            await this.postStore.savePost(posts);
        },
    }
}
</script>
<style scoped>

.btn-outline-dark {
    border-color: rgba(0, 0, 0, 0.2);
}

.btn-outline-dark:hover {
    color: rgba(0, 0, 0);
    background-color: rgb(0, 0, 0, 0.04);
    border-color: #007BFF;
    transition: 0.3s;
    font-weight: bold;
}
</style>