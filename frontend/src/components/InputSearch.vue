<template>
    <div class="dropdown-center" @mouseleave="resetInputSearch">
        <div class="input-group flex-nowrap" @keyup.enter="submit"
            @click="(this.searchText) ? this.showSearch = true : this.showSearch = false">
            <input type="text" class="form-control input-search" placeholder="Search Life" @input="updateModelValue">
            <button class="input-group-text icon-search btn btn-outline-primary" @click="submit">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
        <ul class="dropdown-menu w-100" :class="[(this.showSearch) ? { show: true } : '']">
            <div v-for="(user, index) in users" :key="user._id">
                <li><user-link :userid="user._id" /></li>
            </div>
        </ul>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
import UserLink from '@/components/UserLink.vue';

export default {
    components: {
        UserLink
    },
    data() {
        return {
            users: [],
            searchText: null,
            showSearch: false,
        }
    },
    emits: ["submit:search"],
    methods: {
        async updateModelValue(e) {
            this.searchText = (e.target.value).trim();
            if (e.target.value != '') {
                this.users = await UserService.getUserByFriendList(e.target.value);
            } else {
                this.users = []
            }
            if (this.users.length != 0) {
                this.showSearch = true;
            } else {
                this.showSearch = false;
            }
        },
        resetInputSearch() {
            this.showSearch = false;
        },
        submit() {
            this.$emit("submit:search", this.searchText);
        },
    },
}   
</script>
<style scoped>
.icon-search,
.input-search {
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.3);
}

.icon-search:hover {
    border: 1px solid rgba(0, 0, 0, 0.3);
}

i {
    font-size: 1.2rem;
    padding: 3px;
}

</style>