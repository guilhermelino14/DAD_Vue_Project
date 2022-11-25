import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
axios.defaults.withCredentials = true;


export const cartStore = defineStore({
    id: 'cart',
    state: () => ({
        cart: useStorage('cart',[]),
        cartCount: 0,
        total: 0,
    }),
    getters: {
        getCart: (state) => state.cart,
        getCartCount: (state) => state.cart.length,
        getTotal: (state) => {
            state.total = 0;
            state.cart.forEach(item => {
                state.total +=  parseFloat(item.price)
            })
            return state.total.toFixed(2)
        }
    },
    actions: {
        addToCart(item) {
            this.cart.push(item)
        },
        removeFromCart(item) {
            this.cart.splice(this.cart.indexOf(item), 1)
        },
        clearCart() {
            this.cart = []
        }
    }

})
