<script setup>
import { onMounted, ref, inject } from 'vue';
import axios from 'axios';

const orders = ref([]);
const socket = inject('socket')
const toast = inject('toast')

onMounted(() => {
    orderList();
});

const orderList = () => {
    axios.get(import.meta.env.VITE_API_URL + '/getOrdersToPublicBoard')
        .then(response => {
            orders.value = response.data.data;
        })
        .catch(error => {
            console.log(error);
        });
};

socket.on('updateBoard', (ticket_number, status) => {
    orderList();
    if(ticket_number == null){
        toast.success('Ticket added');
        return;
    }
    toast.success('Ticket ' + ticket_number + ' is ' + status);
});

</script>
<template>
    <v-app>
        <v-main>
            <v-container>
                <v-row class="title">
                    <h1 >Tickets</h1>
                </v-row>
                <div class="container">
                    <v-row class="board">

                        <v-col cols="12" sm="6" md="3" class="item" v-for="item in orders">
                            <div class="item-right">
                                <h2 >{{ item.ticket_number }}</h2>
                                <p >Ticket Number</p>
                                <p :class="item.status">{{item.status}}</p>
                            </div>

                        </v-col> 
                    </v-row>
                </div>
            </v-container>
        </v-main>
    </v-app>
</template>

<style>
.title {
    justify-content: center;
}
.item{
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    margin: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    position: relative;
    text-align: center;
}
/* create an animation for when the item is removed */
.item-leave-active {
    opacity: 0;
    transform: translateY(-50px);
    transition: all 0.3s ease;
}

.board{
    justify-content: center;
    background-color: #f8f9fa;
}

.Preparing{
    background: rgba(255,193,7,20%);
    color: #FFC107;
}
.Ready {
    background: rgba(112, 217, 158, 20%);
    color: #4e9645;
}
.Cancelled {
    background: rgba(248,1,1,20%);
    color: #f80101;
}
.Delivered{
    background: hsla(223, 93%, 60%, 0.2);
    color: #307ffc;
}
.Waiting {
    background: rgba(255,193,7,20%);
    color: #FFC107;
}
</style>