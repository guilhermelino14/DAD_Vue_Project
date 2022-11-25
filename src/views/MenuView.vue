<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Product from "@/components/Product.vue";


let products = ref([])

let page = ref(1);
let lastPage = ref(9);

onMounted(() => {
  loadProducts()
})

const loadProducts = () => {
  axios.get(import.meta.env.VITE_API_URL+'/product?page=' + page.value)
  .then(response => {
    products.value = response.data.data
    lastPage.value = response.data.last_page
  })
}


</script>

<template>
  <main>
    <div class="container">
    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 pt-2" v-for="product in products">
        <Product  :product="product"></Product>
      </div>
    </div>
    <div class="text-center">
        <v-pagination v-model="page" :length="lastPage" @click="loadProducts"></v-pagination>
      </div>
    </div>
    
  </main>
</template>
