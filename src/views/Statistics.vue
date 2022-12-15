<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import StatisticsCard from '../components/StatisticsCard.vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


const storeUser = useUserStore();
const orders = ref([]);

const totalSpent = ref(0);
const totalSpentPoints = ref(0);
const totalPointsEarned = ref(0);

const load = ref(false)
const chartData = ref({
        labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        datasets: [ { 
            label: 'Dinheiro gasto por mes',
            data: [] ,
            backgroundColor: '#588CF5',
        } ]
      })
const chartOptions = ref({
        responsive: true
      })

onMounted(() => {
    axios.get(import.meta.env.VITE_API_URL + '/statistics/' + storeUser.user.id)
        .then(response => {
            orders.value = response.data.data;
        })
        .catch(error => {
            console.log(error);
        });
    axios.get(import.meta.env.VITE_API_URL + '/statistics/totalSpent/' + storeUser.user.id)
        .then(response => {
            totalSpent.value = response.data.totalSpent;
            chartData.value.datasets[0].data = response.data.totalSpent12Mounths
            load.value = true
        })
    axios.get(import.meta.env.VITE_API_URL + '/statistics/totalSpentPoints/' + storeUser.user.id)
        .then(response => {
            totalSpentPoints.value = response.data.totalSpentPoints;
        })
    axios.get(import.meta.env.VITE_API_URL + '/statistics/totalPointsEarned/' + storeUser.user.id)
        .then(response => {
            totalPointsEarned.value = response.data.totalPointsEarned;
        })
});

const statisticsOrderDelivered = computed(() => {
    let total = 0;
    orders.value.forEach(order => {
        if (order.status == 'Delivered') {
            total += 1;
        }
    });
    return total;
});
const statisticsOrderCancelled = computed(() => {
    let total = 0;
    orders.value.forEach(order => {
        if (order.status == 'Cancelled') {
            total += 1;
        }
    });
    return total;
});

const statisticsItemsOrder = computed(() => {
    let total = 0;
    orders.value.forEach(order => {
        order.order_items.forEach(item => {
            total++;
        });
    });
    return total;
});

const averageTimeOfDeliveredOrders = computed(() => {
    let total = 0;
    orders.value.forEach(order => {
        // get from order created_at and order updated_at and calculate the difference
        let created = new Date(order.created_at);
        let updated = new Date(order.updated_at);
        let diff = updated.getTime() - created.getTime();
        total += diff;
    });
    return total;
});

const convertToHoursAndMinuts = () => {
    let milliseconds = averageTimeOfDeliveredOrders.value;
    let hours = Math.floor(milliseconds / 3600000); // 1 Hour = 36000 Milliseconds
    let minutes = Math.floor((milliseconds % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
    let seconds = Math.floor(((milliseconds % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
    if (hours == 0 && minutes == 0) {
        return seconds + ' s';
    }
    if (hours == 0) {
        return minutes + ' m' + seconds + ' s';
    }
    return hours + ' h, ' + minutes + ' m ' + seconds + ' s';
}
</script>

<template>
    <v-app>
        <v-main>
            <v-container>
                <v-row>
                    <v-col xs="12" sm="12" md="6">
                        <StatisticsCard title="Orders delivered" :value="statisticsOrderDelivered"></StatisticsCard>
                    </v-col>
                    <v-col xs="12" sm="12" md="6">
                        <StatisticsCard title="Orders Cancelled" :value="statisticsOrderCancelled"></StatisticsCard>
                    </v-col>
                    <v-col xs="12" sm="12" md="6">
                        <StatisticsCard title="Items Order" :value="statisticsItemsOrder"></StatisticsCard>
                    </v-col>
                    <v-col xs="12" sm="12" md="6">
                        <StatisticsCard title="Average time of delivering" :value="convertToHoursAndMinuts()">
                        </StatisticsCard>
                    </v-col>
                    <v-col xs="12" sm="12" md="6">
                        <StatisticsCard title="Total gasto" :value="totalSpent + '€'"></StatisticsCard>
                    </v-col>
                    <v-col xs="12" sm="12" md="6">
                        <StatisticsCard title="Total de pontos gastos" :value="totalSpentPoints"></StatisticsCard>
                    </v-col>
                    <v-col xs="12" sm="12" md="6">
                        <StatisticsCard title="Pontos ganhos" :value="totalPointsEarned"></StatisticsCard>
                    </v-col>
                </v-row>
                <Bar id="my-chart-id" :options="chartOptions" :data="chartData" v-if="load" />
            </v-container>
        </v-main>
    </v-app>
</template>