<script setup>
import axios from 'axios';
import { defineEmits, ref } from 'vue';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const emit = defineEmits(['createProductChange'])


const productList = () => {
    emit('createProductChange', false)
}

const product = ref({
    name: '',
    type: '',
    description: '',
    price: '',
    photo: [],
})

const createProductPost = () => {
    
    axios.post(import.meta.env.VITE_API_URL + '/products', product.value,{
            headers: {
              'Content-Type': "multipart/form-data; charset=utf-8; boundary=" + Math.random().toString().substr(2),
              Authorization: "Bearer " + userStore.token,
            }
          })
        .then(response => {
            console.log(response.data)
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
    <h3>Create Product</h3>

    <v-card>
        <v-container>
            <v-form ref="form" lazy-validation >
                <v-text-field v-model="product.name" label="Name" required></v-text-field>

                <v-text-field v-model="product.description" label="Description" required></v-text-field>

                <v-text-field v-model="product.price" label="Price" required></v-text-field>

                <v-file-input v-model="product.photo" label="Product Photo" type="file" show-size truncate-length="21"></v-file-input>

                <v-select v-model="product.type" :items="['hot dish', 'cold dish', 'drink', 'dessert']" label="Type" required></v-select>

                <v-btn color="success" @click="createProductPost" class="text-right">
                    Create Product
                </v-btn>
            </v-form>
        </v-container>
    </v-card>
</template>