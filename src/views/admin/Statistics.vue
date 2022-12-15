<script setup>
import { ref, onMounted } from 'vue'
import StatisticsCard from '../../components/StatisticsCard.vue';
import axios from 'axios';

const totalEarn = ref(0)
const totalEarnMounth = ref(0)

onMounted(() => {
    axios.get(import.meta.env.VITE_API_URL + '/statistics/totalEarn/D')
        .then((res) => {
            totalEarn.value = res.data.totalEarn
        })
    axios.get(import.meta.env.VITE_API_URL + '/statistics/totalEarn/Mounth')
        .then((res) => {
            totalEarnMounth.value = res.data.totalEarn
        })
})
</script>
<template>
    <v-row>
        <v-col xs="12" sm="12" md="6">
            <StatisticsCard title="Valor ganho em entregas" :value="totalEarn+'€'"></StatisticsCard>
        </v-col>
        <v-col xs="12" sm="12" md="6">
            <StatisticsCard title="Ganhos nos ultimos 3 meses" :value="totalEarnMounth+'€'"></StatisticsCard>
        </v-col>
    </v-row>
</template>