<template>
    <div class="row">
        <div class="col-lg-1"></div>
        <div class="col-lg-3 col-md-4 col-12">
            <ChatRooms class="bar-fixed" v-if="filteredContactsCount > 0" :contacts="contacts"
                v-model:activeIndex="activeIndex" />
            <p v-else>Không có liên hệ nào.</p>
        </div>
        <div class="col-lg-6 col-md-8 col-12 mt-1 mb-4">
            <div class="card" v-if="activeContact">
                <Message :user="activeContact" />
            </div>
        </div>
        <div class="col-lg-2"></div>
    </div>
</template>
<script>
import UserService from "@/services/user.service";

import ChatRooms from "@/components/message/ChatRooms.vue";
import Message from "@/components/message/Message.vue";
import UserLink from '@/components/UserLink.vue';

export default {
    components: {
        ChatRooms, UserLink, Message
    },
    data() {
        return {
            contacts: [],
            activeIndex: -1
        };
    },
    computed: {
        filteredContactsCount() {
            return this.contacts.length;
        },
        filteredContacts() {
            return this.contacts;
        },
        activeContact() {
            if (this.activeIndex < 0) return null;
            return this.filteredContacts[this.activeIndex];
        },
    },
    methods: {
        async getContacts() {
            this.contacts = await UserService.getFriendList();
        },
    },
    created() {
        this.getContacts()
    },
}
</script>