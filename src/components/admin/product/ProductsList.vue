<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const api = import.meta.env.VITE_API_URL

const products = ref([]);
let page = ref(1);
let maxPage = ref(9);

onMounted(() => {
    productList();
});



const emit = defineEmits(['createProductChange','editProductChange','editingProductChange'])


const productList = () => {
    axios.get(import.meta.env.VITE_API_URL + '/products?page=' + page.value)
        .then(response => {
            products.value = response.data.data;
            maxPage.value = response.data.last_page;
        })
        .catch(error => {
            console.log(error);
        });
};


const createProduct = () => {
    emit('createProductChange', true)
}

const editProduct = (product) => {
    emit('editProductChange', true)
    emit('editingProductChange', product)
}

const deleteProduct = (id) => {
    axios.delete(import.meta.env.VITE_API_URL + '/products/' + id, {
            headers: {
              'Content-Type': "application/json",
              Authorization: "Bearer " + userStore.token,
            }
          })
        .then(response => {
            productList();
        })
        .catch(error => {
            console.log(error);
        });
}
</script>

<template>
    <v-col class="text-right">
        <v-btn color="primary" @click="createProduct">Add Product</v-btn>
    </v-col>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">
                    Foto
                </th>
                <th class="text-left">
                    Name
                </th>
                <th class="text-left">
                    type
                </th>
                <th class="text-left">
                    description
                </th>
                <th class="text-left">
                    price
                </th>
                <th class="text-left">
                    photo_url
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="product in products" :key="product">
                <td><v-img :src="api + '/products/photo/' + product.photo_url "></v-img></td>
                <td>{{ product.name }}</td>
                <td>{{ product.type }}</td>
                <td>{{ product.description }}</td>
                <td>{{ product.price }}</td>
                <td>{{ product.photo_url }}</td>
                <td>
                    <v-btn icon="mdi-pencil" color="info" size="x-small" @click="editProduct(product)"></v-btn>
                    <v-btn icon="mdi-delete" color="error" size="x-small" @click="deleteProduct(product.id)"></v-btn>
                </td>

            </tr>
        </tbody>
    </v-table>
    <div class="text-center">
        <v-pagination v-model="page" :length="maxPage" @click="productList"></v-pagination>
    </div>
</template>