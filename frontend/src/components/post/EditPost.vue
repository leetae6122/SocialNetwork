<template>
    <div v-if="this.post">
        <!-- Modal Edit Post -->
        <div class="modal fade" id="updatePostModal" aria-labelledby="updatePostModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    {{ this.post }}
                    <post-form :post="this.post" @submit:post="updatePost" modalLabels="updatePostModalLabel">
                        Edit post
                    </post-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PostForm from "@/components/post/PostForm.vue";

import PostService from "@/services/post.service";
export default {
    components: {
        PostForm
    },
    data() {
        return {
            post: null
        }
    },
    props: {
        id: { type: String, default: true }
    },
    methods: {
        async updatePost(data) {
            try {
                await PostService.updatePost(data);
                this.$router.go();
            } catch (error) {
                console.log(error);
            }
        },
        async postOne() {
            this.post = await PostService.postOne(this.id);
        },
    },
    created() {
        this.postOne();
    }
}

</script>
<style scoped>
</style>