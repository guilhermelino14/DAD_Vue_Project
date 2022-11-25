<script setup>
import { ref } from 'vue';
import Order_MenuList from '@/components/admin/order_menu/order_menuList.vue';
import Order_MenuView from '@/components/admin/order_menu/order_menuView.vue';

const viewOrder = ref(false);
const orderBeingViewed = ref({})

const viewOrderChange = (value) => {
    viewOrder.value = value
}

const orderWillBeViewed = (order) => {
    orderBeingViewed.value = order
}

</script>
    
<template>
    <Order_MenuList v-if="!viewOrder" @viewOrderChange="viewOrderChange" @orderWillBeViewed="orderWillBeViewed"></Order_MenuList>
    <Order_MenuView v-if="viewOrder" @viewOrderChange="viewOrderChange" :order="orderBeingViewed"></Order_MenuView>
</template>