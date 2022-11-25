<script setup>
import axios from 'axios';
import { ref, onMounted, inject } from 'vue'
import { useUserStore } from '../stores/user';
import { cartStore } from '../stores/cart';
import router from '../router';

const socket = inject("socket")
const storeUser = useUserStore();
const storeCart = cartStore();

const payment_reference = ref('')
const payment_type = ref('')
const user_id = ref(0)

onMounted(() => {
    if (storeUser.islogged) {
        user_id.value = storeUser.getUser.id
        axios.get(import.meta.env.VITE_API_URL + '/customer/' + storeUser.user.id, {
            headers: {
                Authorization: 'Bearer ' + storeUser.user.token
            }
        })
            .then(response => {
                payment_reference.value = response.data.default_payment_reference
                payment_type.value = response.data.default_payment_type
            })
    }
})

const createOrder = () => {
    axios.post(import.meta.env.VITE_API_URL + '/orders', {
        customer_id: user_id.value,
        value: storeCart.getTotal,
        payment_reference: payment_reference.value,
        payment_type: payment_type.value,
        products : storeCart.getCart
    }, {
        headers: {
            Authorization: 'Bearer ' + storeUser.user.token
        }
    })
        .then(response => {
            storeCart.clearCart()
            router.push('/order-history')
            socket.emit('orderCreated', response)
        })
        .catch(error => {
            console.log(error);
        });
}

</script>
<template>
    <v-app>
        <v-main>
            <v-container>
                <v-card>
                    <v-container>
                        <v-card-title>
                            <h1>Payment</h1>
                        </v-card-title>

                        <v-form ref="form" lazy-validation>
                            <v-text-field v-model="payment_reference" label="Payment Reference" required></v-text-field>

                            <v-select v-model="payment_type" :items="['VISA', 'PAYPAL', 'MBWAY']" item-title="item"
                                item-value="item" label="Select" required></v-select>

                            <v-btn color="success" @click="createOrder" class="text-right">
                                Buy
                            </v-btn>
                        </v-form>
                    </v-container>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>