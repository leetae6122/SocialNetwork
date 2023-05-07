<template>
  <div class="container-fluid">
    <app-header />
    <div class="container-fluid py-1">
      <div v-if="($route.matched[0]?.name == 'user')" class="row">
        <div class="col-2" />
        <div class="col-9">
          <profile-nav />
          <router-view :key="$route.fullPath" />
        </div>
        <div class="col-1" />
      </div>
      <div v-else>
        <router-view :key="$route.fullPath" />
      </div>
    </div>
    <div class="fixed-bottom">
      <button class="back-top btn btn-outline-primary" @click="scrollToTop()">
        <i class="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import ProfileNav from "@/components/profile/ProfileNav.vue";

export default {
  components: {
    AppHeader, ProfileNav
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    }
  }
};
</script>

<style scoped>
.back-top {
  z-index: 1000;
  float: right;
  margin: 0 5px 5px 0;
}
</style>
