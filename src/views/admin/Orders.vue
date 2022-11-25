<script setup>
import { ref } from 'vue';
import OrdersList from '@/components/admin/order/OrderList.vue';
//import OrderCreate from '@/components/admin/order/OrderCreate.vue';
import OrderEdit from '../../components/admin/order/OrderEdit.vue';

//const createOrder = ref(false);
const editOrder = ref(false);
const editingOrder = ref({})

/*const createOrderChange = (value) => {
    createOrder.value = value
}*/

const editOrderChange = (value) => {
    editOrder.value = value
}

const editingOrderChange = (order) => {
    editingOrder.value = order
}
</script>

<template>
    <OrdersList v-if="!editOrder" @editOrderChange="editOrderChange" @editingOrderChange="editingOrderChange"></OrdersList>
    <!--<OrderCreate v-if="createOrder" @createOrderChange="createOrderChange"></OrderCreate>-->
    <OrderEdit v-if="editOrder" @editOrderChange="editOrderChange" :order="editingOrder"></OrderEdit>
</template>