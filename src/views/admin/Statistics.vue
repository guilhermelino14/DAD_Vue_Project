<script setup>
import { ref, onMounted } from 'vue'
import StatisticsCard from '../../components/StatisticsCard.vue';
import axios from 'axios';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const totalEarn = ref(0)
const totalEarnMounth = ref(0)
const totalEarn12Mounth = ref([])

onMounted(() => {
    axios.get(import.meta.env.VITE_API_URL + '/statistics/totalEarn/D')
        .then((res) => {
            totalEarn.value = res.data.totalEarn
        })
    axios.get(import.meta.env.VITE_API_URL + '/statistics/totalEarn/Mounth')
        .then((res) => {
            totalEarnMounth.value = res.data.totalEarn
            
            chartData.value.datasets[0].data = res.data.earnsInMounts.reverse()
            load.value = true
        })
    
    
})

const load = ref(false)
const chartData = ref({
        labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        datasets: [ { 
            label: 'Dinheiro por mes',
            data: [] ,
            backgroundColor: '#f87979',
        } ]
      })
const chartOptions = ref({
        responsive: true
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
    <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
    v-if="load"
  />
    
</template>