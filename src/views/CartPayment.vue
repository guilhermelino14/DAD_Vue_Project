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
const couponShow = ref(true)

const olderRequest = ref(0)

const itemsDropdown = ref(['MBWAY', 'PAYPAL', 'VISA']);

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
                } else {
                    couponShow.value = false
                }
                if (storeCart.getTotal > 10) {
                    itemsDropdown.value.splice(0, 1)
                    payment_type.value = 'PAYPAL'
                } if (storeCart.getTotal > 50) {
                    itemsDropdown.value.splice(0, 1)
                    payment_type.value = 'VISA'
                } if (storeCart.getTotal > 200) {
                    itemsDropdown.value.splice(0, 1)
                    payment_type.value = ''
                }
            })
    }

})

const createOrder = () => {
    // if (payment_type.value == 'MBWAY' && payment_reference.value[0] != 9 || payment_reference.value[0] == 0) {
    //     toast.error('Invalid MBWAY reference (must start with 9)')
    //     return
    // }

    // if (payment_type.value == 'VISA' && payment_reference.value[0] != 4 || payment_reference.value[0] == 0) {
    //     toast.error('Invalid VISA reference (must start with 4)')
    //     return
    // }
    
    if (payment_type.value == 'VISA' && payment_reference.value.length != 16) {
        toast.error('Invalid VISA reference (must have 16 digits)')
        return
    }

    if (payment_type.value == 'MBWAY' && payment_reference.value.length != 9) {
        toast.error('Invalid MBWAY reference (must have 9 digits)')
        return
    }
    
    // ir paypal is a valid email
    if (payment_type.value == 'PAYPAL' && payment_reference.value.indexOf('@') == -1) {
        toast.error('Invalid PAYPAL reference (must be a valid email)')
        return
    }
    // if (payment_reference.value.indexOf('.pt') == -1 && payment_reference.value.indexOf('.com') == -1){
    //         toast.error('Invalid PAYPAL reference (must end with .pt or .com)')
    //         return
    //    }
    if (olderRequest.value == 0){
        olderRequest.value = 1
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
}

const priceWithCoupon = computed(() => {
    let price = storeCart.getTotal
    couponSelected.value.forEach(element => {
        price -= 5
    });
    //remove decimal part
    if (couponSelected.value.length == 0) {
        return Math.trunc(price * 100) / 100 + '€'
    }
    return Math.trunc(price * 100) / 100 + '€ (' + couponSelected.value.length + ' coupon(s) used)'
})
const priceWithCouponNumber = computed(() => {
    let price = storeCart.getTotal
    couponSelected.value.forEach(element => {
        price -= 5
    });

    if (Math.trunc(price * 100) / 100 <= 10) {
        if (itemsDropdown.value.indexOf('MBWAY') == -1) {
            itemsDropdown.value.push('MBWAY')
        }
    } if (Math.trunc(price * 100) / 100 <= 50) {
        if (itemsDropdown.value.indexOf('PAYPAL') == -1) {
            itemsDropdown.value.push('PAYPAL')
        }
    } if (Math.trunc(price * 100) / 100 <= 200) {
        if (itemsDropdown.value.indexOf('VISA') == -1) {
            itemsDropdown.value.push('VISA')
        }
    }else{
        itemsDropdown.value.splice(0, 1)
        payment_type.value = ''
    }
    //remove decimal part
    if (couponSelected.value.length == 0) {
        return Math.trunc(price * 100) / 100
    }
    return Math.trunc(price * 100) / 100
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

                            <v-select v-model="payment_type" :items="itemsDropdown" item-title="item"
                                :disabled="priceWithCouponNumber > 200" item-value="item" label="Payment Reference"
                                required></v-select>

                            <div v-if="((user_id != 0) && points >= 10)">
                                <v-combobox v-model="couponSelected" v-show="couponShow" :items="coupon"
                                    label="Use points" multiple chips>
                                </v-combobox>
                            </div>

                            <div class="row">
                                <div class="col-12 col-md-9" style="align-self: center;">Total: {{ priceWithCoupon }}
                                </div>
                                <div class="col-12 col-md-3" style="    text-align-last: right;">
                                    <v-btn color="success" @click="createOrder" class="text-right"
                                        :disabled="payment_type == 'PAGAMENTO INVALIDOS' || payment_type == ''">
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