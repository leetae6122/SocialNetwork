<template>
  <div class="row" v-if="this.user">
    <!-- Nav tabs -->
    <div class=" col-lg-4 col-12 mb-1">
      <ul class="nav nav-pills list-group">
        <li class="nav-item list-group-item">
          <a class="nav-link active" data-bs-toggle="pill" href="#home">Profile</a>
        </li>
        <li class="nav-item list-group-item">
          <a class="nav-link" data-bs-toggle="pill" href="#contact">Contact</a>
        </li>
        <!-- <li v-if="this.authStore.userid == this.user._id" class="nav-item list-group-item">
          <a class="nav-link" data-bs-toggle="pill" href="#changepass">Change Passwords</a>
        </li> -->
      </ul>
    </div>
    <!-- Tab panes -->
    <div class="tab-content col-lg-8 col-12 card">
      <!-- Profile -->
      <div class="tab-pane container active" id="home">
        <button v-if="(this.authStore.userid == this.user._id)" class="btn btn-primary" style="left: 95%;"
          data-bs-toggle="modal" data-bs-target="#editProfileModal">
          <i class="fa-solid fa-gear"></i>
        </button>
        <div>
          <img :src="this.user.avatar?.avatar_data" class="card-img-top" alt="...">
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <h5><i class="fa-solid fa-book-open-reader"></i> Intro</h5>
            {{ this.user.intro }}
          </li>
          <li class="list-group-item">
            <h5><i class="fa-solid fa-signature"></i> Fullname</h5>
            {{ this.user.name?.fullname }}
          </li>
          <li class="list-group-item">
            <h5><i class="fa-solid fa-venus-mars"></i> Gender</h5>
            {{ (this.user.gender) ? "Male" : "Female" }}
          </li>
          <li class="list-group-item">
            <h5><i class="fa-solid fa-cake-candles"></i> Birth date</h5>
            {{ getBirthDate }}
          </li>
        </ul>
      </div>
      <!-- Contact -->
      <div class="tab-pane container fade" id="contact">
        <button v-if="(this.authStore.userid == this.user._id)" class="btn btn-primary" style="left: 95%;"
          data-bs-toggle="modal" data-bs-target="#editContactModal">
          <i class="fa-solid fa-gear"></i>
        </button>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <h5><i class="fa-solid fa-house-chimney-user"></i> Address</h5>
            {{ this.user.address }}
          </li>
          <li class="list-group-item">
            <h5><i class="fa-solid fa-phone"></i> Phone</h5>
            {{ this.user.phone }}
          </li>
          <li class="list-group-item">
            <h5><i class="fa-solid fa-envelope"></i> E-mail</h5>
            {{ this.user.email }}
          </li>
        </ul>
      </div>
      <!-- Change Passwords -->
      <!-- <div class="tab-pane container fade" id="changepass">
        <ChangePassword :user="this.user" @submit:user="updateUser" >
          Change Password
        </ChangePassword>
      </div> -->
    </div>
    <!-- ProfileModal -->
    <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="eidtProfileModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <ProfileForm :user="this.user" @submit:user="updateUser">
            Edit Profile
          </ProfileForm>
        </div>
      </div>
    </div>
    <!-- ContactModal -->
    <div class="modal fade" id="editContactModal" tabindex="-1" aria-labelledby="eidtContactModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <ContactForm :user="this.user" @submit:user="updateUser">
            Edit Contact
          </ContactForm>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UserService from "@/services/user.service";

import ProfileCard from "@/components/profile/ProfileCard.vue";
import ProfileForm from "@/components/profile/ProfileForm.vue";
import ContactForm from "@/components/profile/ContactForm.vue";
import ChangePassword from "@/components/profile/ChangePassword.vue";
import { useAuthStore } from '@/stores/store';
export default {
  components: {
    ProfileCard, ProfileForm, ContactForm, ChangePassword
  },
  computed: {
    getBirthDate() {
      const date = new Date(this.user.birth_date);
      return date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "/" + date.getFullYear().toString();
    },
  },
  data() {
    return {
      authStore: useAuthStore(),
      user: null,
    };
  },
  props: {
    id: { type: String, required: true },
  },
  methods: {
    async getUser(id) {
      this.user = await UserService.getOne(id);
    },
    async updateUser(data) {
      await UserService.updateUser(this.user._id, data);
    },
  },
  created() {
    this.getUser(this.id);
  },
}

</script>
<style scoped>
.bar-fixed {
  margin-top: 0;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

.nav-link {
  padding: 10px;
  font-weight: bold;
}

.card-img-top {
  width: 150px;
  height: 150px;
}
</style>