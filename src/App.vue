<script setup>
import { watch } from 'vue';
import {  RouterView, useRouter} from 'vue-router'
import NavBar from './components/NavBar.vue'
import NavBarAdmin from './components/admin/NavBar.vue'

</script>

<template>
  <div v-if="!$route.meta.hideNavbar">
    <NavBar />
    <RouterView />
  </div>
  <div v-if="$route.meta.hideNavbar">
    <NavBarAdmin />
  </div>
  
</template>


