<template>
  <div class="scrollable">
    <div class="card">
      <div class="card-header bg-white text-center fw-bold">Contacts List</div>
      <ul class="card-body list-group list-group-flush">
        <button class="btn btn-outline-light w-100" v-for="(contact, index) in contacts" :key="contact._id"
          :class="{ active: index === activeIndex }" @click="updateActiveIndex(index, contact._id)">
          <Contact class="mt-2" :userid="contact._id" />
        </button>
      </ul>
      <div class="card-footer">
        <div class="font-italic text-black-50" style="font-size: 0.90rem;">Life Social Network &copy; 2023. Developed by
          Tri
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Contact from '@/components/message/Contact.vue';

import ConversationService from "@/services/conversation.service";
import MessageService from "@/services/message.service";
import { useConversationStore, useAuthStore, useMessageStore } from '@/stores/store';

export default {
  components: {
    Contact
  },
  props: {
    contacts: { type: Array, default: [] },
    activeIndex: { type: Number, default: -1 },
  },
  data() {
    return {
      conversationStore: useConversationStore(),
      messageStore: useMessageStore(),
      authStore: useAuthStore()
    }
  },
  emits: ["update:activeIndex"],
  methods: {
    async updateActiveIndex(index, contactId) {
      const res = await ConversationService.getConversation(contactId);
      const messages = await MessageService.getMessages(res._id);
      await this.conversationStore.saveConversation(res);
      await this.messageStore.saveMessage(messages);
      this.$emit("update:activeIndex", index);
    },
  },

}

</script>
<style scoped>
.scrollable {
  overflow-y: scroll;
  height: 568px;
}

.btn-outline-light {
  --bs-btn-active-bg: #007BFF;
  border: 0;
  margin: 4px 0;
  border-radius: 15px;
}

.card {
  min-height: 568px;
  max-height: fit-content;
  border-radius: 8px;
}

.card-header {
  font-size: 1.2rem;
  font-weight: 700;
  color: #007BFF;
}

.user-status {
  top: 85%;
  left: 85%;
  padding: 0.3rem;
  border: 1px solid white;
}
</style>