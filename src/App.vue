<template>
  <template v-if="route.path.startsWith('/user')">
    <router-view />
  </template>
  <template v-else>
    <BasicLayout />
  </template>
</template>

<style>
#app {
}
</style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useRoute } from "vue-router";
import UserLayout from "@/layouts/userLayout.vue";

const route = useRoute();
</script>
