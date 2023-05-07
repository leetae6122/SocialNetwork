<template>
    <div class="card w-100" @click="updateNews">
        <div v-if="this.notification?.type.add_friend" class="text-start">
            <UserLink :userid="this.notification._sendUid" :showStatus="false" :showPopper="false">
                sent you a friend request.
            </UserLink>
            <TimeAgo class="mx-5" :date_create="this.notification.date_created"></TimeAgo>
            <div class="mt-2">
                <button class="btn btn-primary mx-1" @click="submitNews">
                    <i class="fa-sharp fa-solid fa-circle-check"></i> Confirm
                </button>
                <button class="btn btn-danger mx-1" @click="deleteNews">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
            <span v-if="!this.notification?.readed"
                class="position-absolute status-news translate-middle bg-primary border border-light rounded-circle">
                <span class="visually-hidden">New alerts</span>
            </span>
        </div>
    </div>
</template>
<script>
import TimeAgo from "@/components/TimeAgo.vue";
import UserLink from "@/components/UserLink.vue";

import UserService from "@/services/user.service";
import NewsService from "@/services/news.service";

export default {
    components: {
        TimeAgo, UserLink
    },
    data() {
        return {
            notification: null,
        }
    },
    emits: ["submit:news", "delete:news"],
    props: {
        id: { type: String, required: true }
    },
    methods: {
        async getNews() {
            this.notification = await NewsService.getOne(this.id);
        },
        async submitNews() {
            await UserService.addFriend(this.notification);
            await NewsService.updateConfirmNews(this.id);
            this.$router.go();
        },
        async deleteNews() {
            if (confirm("Bạn muốn xóa Thông báo này?")) {
                try {
                    await NewsService.deleteNews(this.id);
                } catch (error) {
                    console.log(error);
                }
            }
        },
        async updateNews() {
            if (!this.notification?.readed) {
                await NewsService.updateReadedNews(this.id)
                this.$router.go()
            }
        }
    },
    created() {
        this.getNews();
    }
}

</script>
<style scoped>
.card {
    border: none;
}

.card:hover {
    background-color: rgb(245, 245, 245, 0.8);
    border: none;
}

.status-news {
    top: 50%;
    left: 95%;
    padding: 5px;
}
</style>