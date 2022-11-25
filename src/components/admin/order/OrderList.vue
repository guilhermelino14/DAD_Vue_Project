<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import axios from 'axios';
import { useUserStore } from '@/stores/user'
const userStore = useUserStore();

let page = ref(1);
let lastPage = ref(9);
let orders = ref([]);

//const emit = defineEmits(['createOrderChange', 'editOrderChange', 'editingOrderChange'])
const emit = defineEmits(['editOrderChange', 'editingOrderChange'])

onMounted(() => {
    orderList();
});

const orderList = () => {
    axios.get(import.meta.env.VITE_API_URL + '/orders?page=' + page.value)
        .then(response => {
            orders.value = response.data.data;
            lastPage.value = response.data.meta.last_page;
        })
        .catch(error => {
            console.log(error);
        });
    };

const changePage = () => {
    orderList();
};

/*const createOrder = () => {
    emit('createOrderChange', true)
}*/

const editOrder = (order) => {
    emit('editOrderChange', true)
    emit('editingOrderChange', order)
    }

const deleteOrder = (orderID) => {
    axios.delete(import.meta.env.VITE_API_URL + '/orders/' + orderID)
        .then(response => {
            orderList();
        })
        .catch(error => {
            console.log(error);
        });
}

</script>
<template>
    <v-col class="text-right">
        <!--<v-btn color="primary" @click="createOrder">Add Order</v-btn>-->
    </v-col>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">
                    Ticket Number
                </th>
                <th class="text-left">
                    Status
                </th>
                <th class="text-left">
                    Customer_id
                </th>
                <th class="text-left">
                    Price
                </th>
                <th class="text-left">
                    Payment Type
                </th>
                <th class="text-left">
                    Payment Reference
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in orders" :key="order">
                <td>{{ order.ticket_number }}</td>
                <td>{{ order.status }}</td>
                <td>{{ order.customer_id }}</td>
                <td>{{ order.total_price }} €</td>
                <td>{{ order.payment_type }}</td>
                <td>{{ order.payment_reference }}</td>
                <td>
                    <v-btn icon="mdi-pencil" color="info" size="x-small" @click="editOrder(order)"></v-btn>
                    <v-btn icon="mdi-delete" color="error" size="x-small" @click="deleteOrder(order.id)"></v-btn>
                </td>

            </tr>
        </tbody>
    </v-table>
    <div class="text-center">
        <v-pagination v-model="page" :length="lastPage" @click="changePage"></v-pagination>
    </div>
</template>