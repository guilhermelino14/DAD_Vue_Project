<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import axios from 'axios';

const orders = ref([]);
let page = ref(1);
let lastPage = ref(1);

const emit = defineEmits(['viewOrderChange','orderWillBeViewed'])

onMounted(() => {
    orderList();
});

const orderList = () => {
    axios.get(import.meta.env.VITE_API_URL + '/ordersPreparingOrReady?page=' + page.value)
        .then(response => {
            orders.value = response.data.data;
                lastPage.value = response.data.meta.last_page ;
        })
        .catch(error => {
            console.log(error);
        });
};

const changepage = () => {
    orderList();
};

const orderView = (order) => {
    emit('viewOrderChange', true)
    emit('orderWillBeViewed', order)
}

</script>
<template>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">
                    Order Number
                </th>
                <th class="text-left">
                    Ticket Number
                </th>
                <th class="text-left">
                    Price
                </th>
                <th class="text-left">
                    Status
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in orders" :key="order">
                <td>{{ order.id }}</td>
                <td>{{ order.ticket_number }}</td>
                <td>{{ order.total_price }}</td>
                <td>{{ order.status }}</td>
                <td>
                    <v-btn icon="mdi-eye" color="info" size="x-small" @click="orderView(order)"></v-btn>
                </td>

            </tr>
        </tbody>
    </v-table>
    <div class="text-center">
        <v-pagination v-model="page" :length="lastPage" @click="changepage"></v-pagination>
    </div>
</template>