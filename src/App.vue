<script setup>
import { watch, inject } from 'vue';
import {  RouterView, useRouter} from 'vue-router'
import NavBar from './components/NavBar.vue'
import NavBarAdmin from './components/admin/NavBar.vue'

const socket = inject('socket')

socket.on('orderCreated', () => {
    console.log(' Order Created ')
})
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


