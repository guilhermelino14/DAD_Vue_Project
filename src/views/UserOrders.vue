<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import Order from '@/components/Order.vue';
import axios from 'axios';

const storeUser = useUserStore();

const orders = ref([]);
let page = ref(1);
const lastPage = ref(9);

onMounted(() => {
    orderList()
});

const orderList = () => {
    axios.get(import.meta.env.VITE_API_URL+'/orders/'+storeUser.user.id+'?page='+page.value)
        .then(response => {
            orders.value = response.data.data;
            lastPage.value = response.data.meta.last_page;
        })
        .catch(error => {
            console.log(error);
        });
};
const changepage = () => {
    orderList();
};
</script>
<template>
    <v-app>
        <v-main>
                <v-container>
                    <v-row>
                    <v-col sm="12" v-for="order in orders">
                        <Order :order="order"></Order>
                    </v-col>
                    </v-row>
                    <div class="text-center">
                        <v-pagination v-model="page" :length="lastPage" @click="changepage"></v-pagination>
                    </div>
                </v-container>
        </v-main>
    </v-app>    
</template>