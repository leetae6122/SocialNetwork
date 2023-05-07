<template>
        <div class="d-flex">
            <user-link class="" :userid="authStore.userid" :showName="false" :showStatus="false"></user-link>
            <textarea name="inputcomment" @keyup.enter="submitComment" class="form-control my-auto" rows="1"
                placeholder="Write a comment..."></textarea>
            {{ textAreaAutoResize }}
        </div>
</template>
<script>
import CommentService from "@/services/comment.service";
import UserLink from '@/components/UserLink.vue';

import { useAuthStore, useCommentStore } from '@/stores/store';
export default {
    components: {
        UserLink
    },
    data() {
        return {
            authStore: useAuthStore(),
            commentStore: useCommentStore(),
            users: [],
        }
    },
    props: {
        id: { type: String, required: true }
    },
    emits: ["submit:comment"],
    computed: {
        textAreaAutoResize() {
            const txHeight = 16;
            const tx = document.getElementsByTagName('textarea');
            for (let i = 0; i < tx.length; i++) {
               
                if (tx[i].value == '') {
                    tx[i].setAttribute("style", "height:" + txHeight + "px;overflow-y:hidden;");
                } else {
                    tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
                }
                tx[i].addEventListener("keyup", (e) => {
                    if (e.key === 'Enter') {
                        tx[i].style.height = '50px';
                        tx[i].value = '';
                    }
                }, false);
                tx[i].addEventListener("input", () => {
                    console.log('run');
                    tx[i].style.height = 'auto';
                    tx[i].style.height = (tx[i].scrollHeight) + "px";
                }, false);
            }

        }
    },
    methods: {
        submitComment(e) {
            const text = (e.target.value).trim();
            this.$emit("submit:comment", text);
            (e.target.value) = '';
        },
        async submit(e) {
            const text = (e.target.value).trim();
            const res = await CommentService.createPostComments(this.id, text);
            await this.commentStore.saveComment([...this.commentStore.comments, res]);
            e.target.value = ''
        },
    }
}   
</script>
<style scoped>
textarea {
    width: 100%;
    box-sizing: border-box;
    border-radius: 18px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    resize: none;
}
</style>