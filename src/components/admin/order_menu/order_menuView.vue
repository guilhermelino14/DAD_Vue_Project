<script setup>
import axios from 'axios';
import { ref, defineEmits, defineProps, inject } from 'vue';
import { useUserStore } from '@/stores/user';

const props = defineProps(['order'])
const emit = defineEmits(['viewOrderChange'])

const socket = inject('socket')

const storeUser = useUserStore();
const order = ref(props.order);
const alert = ref({
    show: false,
    message: '',
    type: 'warning'
});


const api = ref(import.meta.env.VITE_API_URL);

const order_menulist = () => {
    emit('viewOrderChange', false)
};


const orderUpdate = (thisOrder) => {
    axios.put(api.value + '/orderUpdate', {
        order: thisOrder
    }, {
        headers: {
            Authorization: 'Bearer ' + storeUser.user.token
        }
    })
        .then(response => {
            alert.value = {
                show: true,
                message: response.data.message,
                type: 'success'
            }
            order.value = response.data.order;
            if (order.value.status == 'Ready') {
                if (order.value.customer_id != null) {
                    axios.get(api.value + '/costumerGetUser/' + order.value.customer_id).then((res) => {
                        socket.emit('orderReady', { order: order.value, userId: res.data.user.id })
                    })
                }else{
                    socket.emit('orderReady', { order: order.value, userId: null })
                }


            }
        })
        .catch(error => {
            console.log(error.response.data.message);
            alert.value = {
                show: true,
                message: error.response.data.message,
                type: 'warning'
            }
        });
};

const order_itemUpdate = (item) => {
    axios.put(api.value + '/orderItemUpdate', item, {
        headers: {
            Authorization: 'Bearer ' + storeUser.user.token
        }
    })
        .then(response => {
            reloadOrder();
        })

}

const reloadOrder = () => {
    axios.get(api.value + '/showOrderwithId/' + order.value.id, {
        headers: {
            Authorization: 'Bearer ' + storeUser.user.token
        }
    })
        .then(response => {
            order.value = response.data.data;
        })
}

</script>
<template>
    <v-alert dense :type="alert.type" v-show="alert.show">
        {{ alert.message }}
    </v-alert>
    <v-col class="text-left">
        <v-btn icon="mdi-chevron-left" color="info" @click="order_menulist"></v-btn>
        <v-row style="justify-content:center">
            <div :class="{ currentActive: order.status == 'Preparing' }">
                <v-icon size="50">
                    a
                </v-icon>
                <span>Preparing</span>
            </div>
            <div :class="{ currentActive: order.status == 'Ready', opacityItem: order.status == 'Preparing' }">
                <v-icon size="50">
                    mdi-chevron-right
                </v-icon>
                <span>Ready</span>
            </div>
            <div
                :class="{ currentActive: order.status == 'Delivered', opacityItem: order.status == 'Preparing' || order.status == 'Ready' }">
                <v-icon size="50">
                    mdi-chevron-right
                </v-icon>
                <span>Delivered</span>
            </div>
        </v-row>
    </v-col>

    <v-card>
        <template v-slot:prepend>
            <v-card-item>
                <v-card-title class="mb-5">Order Number {{ order.id }}</v-card-title>

                <v-card-subtitle>Order Date {{ order.created_at }}</v-card-subtitle>
            </v-card-item>
            <v-card-text>
                Total: <span style="color: green;">{{ order.total_price }} €</span>
            </v-card-text>
        </template>
        <template v-slot:append>
            <div class="justify-self-end">
                <div class="box" :class="order.status">
                    {{ order.status }}
                </div>
            </div>
        </template>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="deep-purple lighten-2" text @click="orderUpdate(order)" v-if="order.status == 'Preparing'">
                Order is ready
            </v-btn>
            <v-btn color="deep-purple lighten-2" text @click="orderUpdate(order)" v-if="order.status == 'Ready'">
                Order Delivering
            </v-btn>
        </v-card-actions>
    </v-card>
    <v-card class="mt-5" v-for="order_item in order.order_items">
        <v-card-text>
            <v-row>
                <v-col md="3">
                    <v-img :src="api + '/products/photo/' + order_item.product.photo_url" class="img_size_photo">
                    </v-img>
                </v-col>
                <v-col md="9">
                    <v-card-title class="mb-5">{{ order_item.product.name }} <span class="box"
                            :class="order_item.status">{{ order_item.status }}</span></v-card-title>
                    <v-card-subtitle>Price: {{ order_item.product.price }} €</v-card-subtitle>

                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="deep-purple lighten-2" text @click="order_itemUpdate(order_item)"
                v-if="order_item.status == 'Waiting'">
                Prepare dish
            </v-btn>
            <v-btn color="deep-purple lighten-2" text @click="order_itemUpdate(order_item)"
                v-if="order_item.status == 'Preparing'">
                Dish is ready
            </v-btn>
        </v-card-actions>
    </v-card>



</template>

<style scoped>
.box {
    border: 1px solid transparent;
    padding: 10px;
    margin: 10px;
}

.opacityItem {
    opacity: 20%;
}

.currentActive {
    color: green;
    font-weight: bold;
}

.Preparing {
    background: rgba(255, 193, 7, 20%);
    color: #FFC107;
}

.Ready {
    background: rgba(112, 217, 158, 20%);
    color: #4e9645;
}

.Cancelled {
    background: rgba(248, 1, 1, 20%);
    color: #f80101;
}

.Delivered {
    background: hsla(223, 93%, 60%, 0.2);
    color: #307ffc;
}

.Waiting {
    background: rgba(255, 193, 7, 20%);
    color: #FFC107;
}
</style>