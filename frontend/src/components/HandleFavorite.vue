<template>
    <button v-if="this.isFavorited == true" class="btn btn-outline-primary border-0 w-100" @click="pressUnfavorite">
        <i class="fa-solid fa-heart"></i> <span class="fw-bold">Unfavorite</span>
    </button>
    <button v-else class="btn btn-outline-primary border-0 w-100" @click="pressFavorite">
        <i class="fa-regular fa-heart"></i> <span class="fw-bold">Favorite</span>
    </button>
</template>
<script>
import PostService from "@/services/post.service";

export default {
    data() {
        return {
            isFavorited: false,

        }
    },
    props: {
        postid: { type: String, default: null },
        favoritePosts: { type: Array, default: [] },
        modelValue: { type: Number }
    },
    emits: ["update:modelValue"],
    methods: {
        async pressUnfavorite() {
            this.isFavorited = false;
            await PostService.pressUnfavorite(this.postid);
            this.$emit("update:modelValue", this.modelValue - 1);
        },
        async pressFavorite() {
            this.isFavorited = true;
            await PostService.pressFavorite(this.postid);
            this.$emit("update:modelValue", this.modelValue + 1);
        },
        checkIsFavorite() {
            for (let item of this.favoritePosts) {
                if (item._id == this.postid) {
                    this.isFavorited = true;
                }else this.isFavorited = false;
            }
        }
    },
    created(){
        this.checkIsFavorite();
    },


}
</script>
<style scoped>
.fa-heart{
    color: red;
}
</style>