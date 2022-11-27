<script setup>
import { watch, inject, onMounted } from 'vue';
import {  RouterView, useRouter} from 'vue-router'
import { useUserStore } from '@/stores/user';
import NavBar from './components/NavBar.vue'
import NavBarAdmin from './components/admin/NavBar.vue'

const toast = inject("toast")
const storeUser = useUserStore();


const socket = inject('socket')

onMounted(() => {
  if(storeUser.getUser.id != null){
    socket.emit('loggedIn', storeUser.getUser, null)
    return
  }
  if(storeUser.getSocketId == null){
    socket.emit('loggedIn', null, storeUser.getSocketId)
    return
  }
  if(storeUser.getSocketId != null){
    socket.emit('loggedIn', null, storeUser.getSocketId)
    return
  }
})

socket.on('nonCostumerGetId', (socket) => {
  if(storeUser.getSocketId == null){
    storeUser.setSocketId(socket)
  }
})

socket.on('orderCreated', (order) => {
    toast.success(`A new order was created (#${order.id} with ticket number : ${order.ticket_number})`)
    // console.log(' Order Created ')
})

socket.on('orderReady', (order) => {
    toast.success(`Order number :${order.id} | ticker number ${order.ticket_number} is ready`)
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


