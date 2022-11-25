<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import { useUserStore } from '@/stores/user'
const userStore = useUserStore();

let page = ref(1);
let lastPage = ref(9);
let orders = ref([]);

onMounted(() => {
    orderList();
});

const orderList = () => {
    axios.get(import.meta.env.VITE_API_URL + '/orders?page=' + page.value)
        .then(response => {
            orders.value = response.data.data;
            lastPage.value = response.data.last_page;
        })
        .catch(error => {
            console.log(error);
        });
};
</script>
<template>
    {{orders}}
</template>