<script setup>
import axios from 'axios';
import { ref, onMounted, inject, computed } from 'vue'
import { useUserStore } from '../stores/user';
import { cartStore } from '../stores/cart';
import router from '../router';

const socket = inject("socket")
const toast = inject("toast")
const storeUser = useUserStore();
const storeCart = cartStore();

const couponSelected = ref([]);
const coupon = ref([]);

const payment_reference = ref('')
const payment_type = ref('')
const points = ref(0)
const user_id = ref(0)

onMounted(() => {
    if (storeUser.islogged) {
        user_id.value = storeUser.getUser.id
        axios.get(import.meta.env.VITE_API_URL + '/customers/' + storeUser.user.id, {
            headers: {
                Authorization: 'Bearer ' + storeUser.user.token
            }
        })
            .then(response => {
                payment_reference.value = response.data.default_payment_reference
                payment_type.value = response.data.default_payment_type
                points.value = response.data.points
                if (storeCart.getTotal >= 5) {
                    let coupon_number = 1
                    for (let i = 1; i <= response.data.points; i++) {
                        if (i % 10 == 0) {
                            if (coupon.value.length + 1 <= Math.trunc(storeCart.getTotal / 5)) {
                                coupon.value.push(coupon_number + ' - 5 € discount')
                                coupon_number++
                            }
                        }
                    }
                }
            })
    }

})

const createOrder = () => {
    axios.post(import.meta.env.VITE_API_URL + '/orders', {
        customer_id: user_id.value,
        value: storeCart.getTotal,
        payment_reference: payment_reference.value,
        payment_type: payment_type.value,
        products: storeCart.getCart,
        custom: storeUser.getSocketId,
        points: couponSelected.value.length
    }, {
        headers: {
            Authorization: 'Bearer ' + storeUser.user.token
        }
    })
        .then(response => {
            storeCart.clearCart()
            socket.emit('orderCreated', response)
            toast.success('Order created')
            if (user_id.value != 0) {
                router.push('/order-history')

            } else {
                router.push('/')
            }
        })
        .catch(error => {
            console.log(error);
        });
}

const priceWithCoupon = computed(() => {
    let price = storeCart.getTotal
    couponSelected.value.forEach(element => {
        price -= 5
    });
    //remove decimal part
    if(couponSelected.value.length == 0){
        return Math.trunc(price * 100) / 100 + '€'
    }
    return Math.trunc(price * 100) / 100 + '€ (' + couponSelected.value.length + ' coupon(s) used)'
})

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

                            <div v-if="((user_id != 0) && points >= 10)">
                                <v-combobox v-model="couponSelected" :items="coupon" label="Use points" multiple chips>
                                </v-combobox>
                            </div>

                            <div class="row">
                                <div class="col-12 col-md-9" style="align-self: center;">Total: {{ priceWithCoupon }}</div>
                                <div class="col-12 col-md-3" style="    text-align-last: right;">
                                    <v-btn color="success" @click="createOrder" class="text-right">
                                        Buy
                                    </v-btn>
                                </div>
                            </div>
                        </v-form>
                    </v-container>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>