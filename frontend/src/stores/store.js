import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userid: null,
        token: null,
        login: false,
    }),

    actions: {
        logIn(data) {
            this.userid = data.userid;
            this.token = data.AccessToken;
            this.login = true;
        },
        logOut() {
            this.userid = null;
            this.token = null;
            this.login = false;
        }
    },
    persist: true,
});

export const useConversationStore = defineStore('conversation', {
    state: () => ({
        conversation: null
    }),

    actions: {
        saveConversation(data) {
            this.conversation = data;
        }
    },
})

export const useMessageStore = defineStore('message', {
    state: () => ({
        messages: []
    }),

    actions: {
        saveMessage(data) {
            this.messages = data;
        }
    },
})

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: []
    }),

    actions: {
        savePost(data) {
            this.posts = data;
        }
    },
})

export const useCommentStore = defineStore('comment', {
    state: () => ({
        comments: []
    }),

    actions: {
        saveComment(data) {
            this.comments = data;
        }
    },
})
