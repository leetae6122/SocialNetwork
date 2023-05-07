<template>
    <div class="row">
        <ul class="list-group col-lg-3 col-12 h-100">
            <li class="list-group-item">
                <router-link class="btn btn-outline-primary w-100 fs-5" :to="{ name: 'friends' }">
                    <i class="fa-solid fa-house"></i> Home
                </router-link>
            </li>
            <li class="list-group-item">
                <router-link class="btn btn-outline-primary w-100 fs-5 active" :to="{ name: 'friends.requests' }">
                    <i class="fa-solid fa-user-check"></i> Friend requests
                </router-link>
            </li>
            <li class="list-group-item">
                <router-link class="btn btn-outline-primary w-100 fs-5" :to="{ name: 'friends.list' }">
                    <i class="fa-solid fa-users"></i> All Friends
                </router-link>
            </li>
        </ul>
        <div class="col-lg-9 col-12">
            <div class="row">
                <div class="card col-lg-4 col-md-6 col-12 my-1" v-for="(item, index) in news">
                    <Notification :id="item._id" :key="item._id" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Notification from "@/components/Notification.vue";

import NewsService from "@/services/news.service";
export default {
    components: {
        Notification
    },
    data() {
        return {
            news: []
        }
    },
    methods: {
        async getAllNews() {
            this.news = await NewsService.getAll();
        },
    },
    created() {
        this.getAllNews();
    }

}
</script>

<style scoped>
.list-group-item,
.btn-outline-primary {
    border: none;
}
</style>