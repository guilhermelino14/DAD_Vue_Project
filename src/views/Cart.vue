<script setup>
import { ref } from 'vue'
import { cartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const storeCart = cartStore();
const router = useRouter();

const api = ref(import.meta.env.VITE_API_URL);

const paymentRoute = () => {
    if (storeCart.getCartCount > 0) {
        router.push('/cart-payment');
    } else {
        router.push('/cart');
    }
};
</script>
<template>
    <v-app>
        <v-main>
            <v-container>
                <v-card>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Photo
                                </th>
                                <th class="text-left">
                                    Name
                                </th>
                                <th class="text-left">
                                    description
                                </th>
                                <th class="text-left">
                                    price
                                </th>
                                <th class="text-left">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in storeCart.getCart" :key="item">
                                <td>
                                    <v-img :src="api + '/products/photo/' + item.photo_url"></v-img>
                                </td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.description }}</td>
                                <td>{{ item.price }}€</td>
                                <td>
                                    <v-btn icon="mdi-delete" color="error" size="x-small"
                                        @click="storeCart.removeFromCart(item)">
                                    </v-btn>
                                </td>

                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
                <v-row class="mt-5 mr-4 justify-end">
                    {{storeCart.getTotal}} €
                </v-row>
                <v-row class="mt-5 justify-end">
                    <v-btn color="primary" @click="paymentRoute">
                        Checkout
                    </v-btn>
                </v-row>
            </v-container>
        </v-main>

    </v-app>
</template>