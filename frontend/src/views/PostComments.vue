<template>
    <div class="card border-0">
        <div class="row" v-if="this.post && this.user">
            <div class="col-lg-2"></div>
            <div class="col-lg-6 col-sm-12">
                <div class="row post-header bg-white mx-auto">
                    <div class="col-8 text-end fw-bold">
                        {{ this.user.name?.fullname + "\'s post"}}
                    </div>
                    <div class="col-4 text-end">
                        <button class="btn rounded-circle border-0" @click="comeBack">
                            <i class="fa-solid fa-circle-chevron-left"></i>
                        </button>
                    </div>
                </div>
                <PostCard :post="this.post" />
                <comments-list class="mt-1 mb-2" :postid="this.post._id"></comments-list>
            </div>
            <div class="col-lg-3 col-sm-12">
                <profile-card class="bar-fixed" :user="this.user"></profile-card>
            </div>
            <div class="col-lg-1"></div>
        </div>
    </div>
</template>
<script>
import PostCard from "@/components/post/PostCard.vue";
import ProfileCard from "@/components/profile/ProfileCard.vue";
import CommentsList from "@/components/comment/CommentsList.vue";

import UserService from "@/services/user.service";
import PostService from "@/services/post.service";
export default {
    components: {
        PostCard,
        ProfileCard,
        CommentsList
    },
    data() {
        return {
            post: null,
            user: null
        }
    },
    props: {
        id: { type: String, required: true }
    },
    methods: {
        async postOne() {
            this.post = await PostService.postOne(this.id);
            this.getUser();
        },
        async getUser() {
            this.user = await UserService.getOne(this.post._uid);
        },
        comeBack() {
            this.$router.go(-1)
        }
    },
    created() {
        this.postOne();
    }
}

</script>
<style scoped>
.post-header{
    font-size: 1.75rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}
i{
    font-size: 1.75rem;
}
.bar-fixed {
    margin-top: 0;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
}
</style>