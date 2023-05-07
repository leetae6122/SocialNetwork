<template>
    <div class="card">
        <comment-form :id="postid"  @submit:comment="createComment"></comment-form>
        <ul v-if="filteredCommentsCount > 0" class="list-group">
            <li class="list-group-item" v-for="(comment, index) in this.commentStore.comments" :key="comment._id">
                <div class="d-flex">
                    <user-link :userid="comment._uid" :showStatus="false" />
                    <div class="my-auto">
                        <TimeAgo :date_create="comment.date_created" :changed="comment.changed" />
                    </div>
                </div>
                <div class="content d-flex">
                    <div class="card item-content" :class="(comment._uid == this.authStore.userid) ? 'owner' : ''">
                        {{ comment.content }}
                    </div>
                    <div class="dropdown-center">
                        <a class="btn btn-outline-light rounded-circle my-auto" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="fa-solid fa-ellipsis"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <div v-if="comment._uid == this.authStore.userid">
                                <li><button class="dropdown-item">Edit</button></li>
                                <li>
                                    <button class="dropdown-item" @click="deleteCommet(comment._id)">
                                        Delete
                                    </button>
                                </li>
                            </div>
                            <li><button class="dropdown-item">Reply</button></li>
                        </ul>
                    </div>
                </div>
                <!-- <comment-form class="w-75 mx-3" :id="comment._id"></comment-form> -->
            </li>
        </ul>
    </div>
</template>
<script>
import TimeAgo from "@/components/TimeAgo.vue";
import UserLink from "@/components/UserLink.vue";
import CommentForm from "@/components/comment/CommentForm.vue";

import CommentService from "@/services/comment.service";

import { useAuthStore, useCommentStore } from '@/stores/store';
export default {
    components: {
        TimeAgo, UserLink, CommentForm
    },
    data() {
        return {
            authStore: useAuthStore(),
            commentStore: useCommentStore()
        }
    },
    props: {
        postid: { type: String, required: true }
    },
    computed: {
        filteredCommentsCount() {
            return this.commentStore.comments.length;
        },
    },
    methods: {
        async createComment(data){
            const res = await CommentService.createPostComments(this.postid, data);
            await this.commentStore.saveComment([...this.commentStore.comments, res]);
        },
        async getPostCommets() {
            const comments = await CommentService.getPostComments(this.postid);
            await this.commentStore.saveComment(comments);
        },
        async deleteCommet(commentId) {
            await CommentService.deleteComment(commentId);
            const comments = await CommentService.getPostComments(this.postid);
            await this.commentStore.saveComment(comments);
        },
    },
    created() {
        this.getPostCommets();
    }
}
</script>
<style scoped>
.item-content {
    border-radius: 10px;
    border: none;
    background-color: rgba(245, 245, 245);
    width: fit-content;
    margin-left: 10px;
    padding: 8px 10px;
}

.item-content.owner {
    background-color: #007BFF;
    color: white;
}

ul,
li {
    border: 0;
    border-radius: 0%;
    padding: 5px;
}

.btn-outline-light {
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: black;
    margin-left: 5px;
    display: none;
}

.dropdown-menu {
    --bs-dropdown-min-width: fit-content;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
}

.dropdown-item {
    padding: 3px 6px;
    margin: 0;
}

.content:hover {
    border-left: 1px solid rgb(30, 135, 255);
}

.content:hover a {
    display: block;
}

.content {
    border-bottom: 0;
    border-top: 0;
    border-right: 0;
    border-radius: 0;
    border-left: 1px solid rgba(0, 0, 0, 0.5);
    margin-left: 25px;
}
</style>