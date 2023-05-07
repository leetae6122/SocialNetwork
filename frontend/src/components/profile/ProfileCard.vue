<template>
    <div class="card text-dark">
        <div v-if="showDetail">
            <img :src="this.user.avatar?.avatar_data" class="card-img-top" alt="Avatar User">
            <h4 class="card-title text-center fw-bold ">{{ this.user.name?.fullname }}</h4>
            <div class="card-text">
                <h5 class="fw-bold"><i class="fa-solid fa-book-open-reader"></i> Intro</h5>
                <span class="mx-1">{{ this.user.intro }}</span>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>
                            <i class="fa-solid fa-house-user"></i>
                            <span class="fw-bold"> Lives in </span>
                        </th>
                        <th>
                            <i class="fa-solid fa-cake-candles"></i>
                            <span class="fw-bold"> Birth date </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ this.user.address }}</td>
                        <td>{{ getBirthDate }}</td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th>
                            <i class="fa-solid fa-venus-mars"></i>
                            <span class="fw-bold"> Gender </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ (this.user.gender) ? "Male" : "Female" }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <div v-if="this.user._id">
                <router-link :to="{
                    name: 'user.posts',
                    params: { id: this.user._id }

                }">
                    <img :src="this.user.avatar?.avatar_data" class="card-img-top" alt="Avatar User">
                    <h4 class="text-center fw-bold mt-1">{{ this.user.name?.fullname }}</h4>
                    <h5 class="fw-bold"><i class="fa-solid fa-book-open-reader"></i> Intro</h5>
                    <span class="mx-1">{{ this.user.intro }}</span>
                </router-link>
            </div>
        </div>

        <!-- Button -->
        <div class="text-center mt-1">
            <div v-if="(this.authStore.userid == this.user._id)">
                <router-link class="btn btn-primary py-1 px-2" :to="{
                    name: 'user.about',
                    params: { id: this.user._id }

                }">
                    <i class="fa-solid fa-user-gear"></i> Edit Profile
                </router-link>
            </div>
            <div v-else>
                <div v-if="isFriend">
                    <button class="btn btn-danger py-1 px-2" @click="unFriend">
                        <i class="fa-solid fa-user-minus"></i> Unfriend
                    </button>
                </div>
                <div v-else>
                    <button class="btn btn-success py-1 px-2" @click="newsAddFriend">
                        <i class="fa-solid fa-user-plus"></i> Add Friend
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import NewsService from "@/services/news.service";
import UserService from "@/services/user.service";
import { useAuthStore } from '@/stores/store';

export default {
    data() {
        return {
            authStore: useAuthStore(),
            isFriend: false
        }
    },
    props: {
        user: { type: Object, required: true },
        showDetail: { type: Boolean, default: true },
        showPopper: { type: Boolean, default: false },
    },
    computed: {
        getBirthDate() {
            if (this.user.birth_date) {
                const date = new Date(this.user.birth_date);
                return date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "/" + date.getFullYear().toString();
            } else {
                return '';
            }

        }
    },
    methods: {
        async checkIsFriend() {
            const list = await UserService.getFriendList();
            for (const item of list) {
                if (item._id == this.user._id) {
                    this.isFriend = true;
                    break;
                }
            }
        },
        async newsAddFriend() {
            await NewsService.createNewsAddFriend(this.user._id);
        },
        async unFriend() {
            await UserService.unFriend(this.user._id);
            this.$router.go();
        },
    },
    created() {
        this.checkIsFriend();
    }
}

</script>
<style scoped>
.card-img-top {
    border: 0.5px solid rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

.card {
    border: 0.5px solid rgba(0, 0, 0, 0.1);
}

.table {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

th,
td {
    border: none;
    padding: 0;
}
</style>