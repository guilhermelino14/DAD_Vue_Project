<script setup>
import axios from 'axios';
import { defineEmits, ref, defineProps } from 'vue';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const emit = defineEmits(['editProductChange'])
const props = defineProps(['product'])
const product = props.product

const alert = ref(null)

const productList = () => {
    emit('editProductChange', false)
}



const createProductPost = () => {
    
    axios.put(import.meta.env.VITE_API_URL + '/products/' + product.id, product,{
            headers: {
              'Content-Type': "application/json",
              Authorization: "Bearer " + userStore.token,
            }
          })
        .then(response => {
            alert.value = response.data.message
            //productList()
        })
        .catch(error => {
            console.log(error)
        })
}
</script>

<template>
    <v-col class="text-left">
        <v-btn icon="mdi-chevron-left" color="info" @click="productList"></v-btn>
    </v-col>
    <h3>Edit Product</h3>
    <v-alert v-if="alert != null" type="success">{{alert}}</v-alert>
    <v-card>
        <v-container>
            <v-form ref="form" lazy-validation >
                <v-text-field v-model="product.name" label="Name" required></v-text-field>

                <v-text-field v-model="product.description" label="Description" required></v-text-field>

                <v-text-field v-model="product.price" label="Price" required></v-text-field>
                
                <v-select v-model="product.type" :items="['hot dish', 'cold dish', 'drink', 'dessert']" label="Type" required></v-select>

                <v-btn color="success" @click="createProductPost" class="text-right">
                    Edit Product
                </v-btn>
            </v-form>
        </v-container>
    </v-card>
</template>