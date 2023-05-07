<template>
    <div class="card-header">
        <UserLink class="mt-2" :userid="user._id" :key="user._id" />
    </div>
    <div class="card-body scrollable" ref="myScrollTarget">
        <ul v-if="filteredMessagesCount > 0">
            <li class="list-group-item my-1" v-for="(message, index) in this.messageStore.messages" :key="message._id">
                <div v-if="(message.senderId != this.authStore.userid)" class="container">
                    <Contact class="img left" :userid="message.senderId" :isLink="false" />
                    <div class="left text">
                        <h6>{{ message.text }}</h6>
                        <TimeAgo :date_create="message.createdAt" :changed="message.changed" />
                    </div>
                </div>
                <div v-else class="container owner ">
                    <div class="dropdown-center" v-if="message.senderId == this.authStore.userid">
                        <a class="btn btn-outline-light rounded-circle my-auto" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="fa-solid fa-ellipsis"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <!-- <li><button class="dropdown-item">Edit</button></li> -->
                            <li>
                                <button class="dropdown-item" @click="deleteMessage(message._id)">
                                    Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                    <Contact class="img right" :userid="message.senderId" :isLink="false" />
                    <div class="right text">
                        <h6 class="text-end">{{ message.text }}</h6>
                        <TimeAgo class="right text-white" :date_create="message.createdAt" :changed="message.changed" />
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <div class="card-footer text-muted">
        <MessageForm @submit:message="createMessage" />
    </div>
</template>
<script>

import UserLink from '@/components/UserLink.vue';
import Contact from '@/components/message/Contact.vue';
import TimeAgo from "@/components/TimeAgo.vue";
import MessageForm from "@/components/message/MessageForm.vue";

import MessageService from "@/services/message.service";
import { useConversationStore, useAuthStore, useMessageStore } from '@/stores/store';

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
export default {
    components: {
        UserLink, TimeAgo, MessageForm, Contact
    },
    props: {
        user: { type: Object, required: true },
    },
    data() {
        return {
            conversationStore: useConversationStore(),
            messageStore: useMessageStore(),
            authStore: useAuthStore(),
            room: '',
            msg: ''
        }
    },
    computed: {
        filteredMessagesCount() {
            return this.messageStore.messages.length;
        },
    },
    methods: {
        async createMessage(data) {
            const message = {
                conversationId: this.conversationStore.conversation._id,
                senderId: this.authStore.userid,
                text: data
            }
            const res = await MessageService.createMessage(message);
            await this.messageStore.saveMessage([...this.messageStore.messages, res]);
            this.msg = data;
            this.sendSocket();
        },
        async deleteMessage(messageId) {
            await MessageService.deleteMessage(messageId);
            const messages = await MessageService.getMessages(this.conversationStore.conversation._id);
            await this.messageStore.saveMessage(messages);
        },
        scrollToBottom() {
            const targetRef = this.$refs.myScrollTarget;
            this.$nextTick(() => {
                targetRef.scrollTo(
                    {
                        top: targetRef.scrollHeight,
                        behavior: "smooth"
                    }
                );
            });
        },
        async createSocket() {
            this.room = this.conversationStore.conversation._id;
            socket.emit("room", this.room);
        },
        async sendSocket() {
            const data = {
                room: this.room,
                msg: this.msg
            }
            socket.emit('send', data)
        },
        receiveSocket() {
            socket.on('receive', async (data) => {
                const messages = await MessageService.getMessages(this.conversationStore.conversation._id);
                await this.messageStore.saveMessage(messages);
            })
        },
    },
    created() {
        this.createSocket();
    },
    mounted() {
        this.scrollToBottom();
        this.receiveSocket()
    },
    updated() {
        this.scrollToBottom();
    }
}
</script>
<style scoped>
.scrollable {
    overflow: hidden;
    overflow-y: scroll;
    height: 430px;
}

/* Chat containers */
.container {
    border: 2px solid #dedede;
    background-color: #f8f8f8;
    border-radius: 15px;
    padding: 5px;
    margin: 5px 0;
    color: #181818;
}

/* owner chat container */
.owner {
    border-color: #ccc;
    background-color: #007BFF;
    color: white;
}

/* Clear floats */
.container::after {
    content: "";
    clear: both;
    display: table;
}

/* Style the right */
.container .right {
    float: right;
    margin: 0 10px;
}

/* Style the left */
.container .left {
    float: left;
    margin: 0 10px;
}

/* Style the right text */
.container .right .text {
    margin-right: 20px;
}

/* Style the left text */
.container .left .text {
    margin-left: 20px;
}

/* Style the image */
.img {
    width: max-content;
}

div.text {
    width: 15lh;
}
</style>