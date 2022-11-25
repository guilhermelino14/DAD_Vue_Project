<script setup>
import { defineProps } from 'vue';
import { cartStore } from '@/stores/cart'


const storeCart = cartStore();
const props = defineProps(['product'])
const api = import.meta.env.VITE_API_URL

const addToCart = (product) => {
  storeCart.addToCart(product)
}
</script>
<template>
  <!-- <div class="card cardheight" >
      <img class="card-img-top photoPosition" :src="'http://localhost:80/api/product/photo/' + product.photo_url " alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">{{product.name}}</h5>
        <p class="card-text">{{product.description}}</p>
        <p class="card-text">{{product.price}}€</p>
        <a href="#" class="btn btn-primary buttonRight" >Go somewhere</a>
      </div>
    </div> -->
  <v-card class="mx-auto" max-width="400">
    <v-img class="align-end text-white" height="200" :src="api + '/product/photo/' + product.photo_url " cover>
      <!-- <v-card-title class="text-black">{{product.name}}</v-card-title> -->
    </v-img>

    <v-card-subtitle class="pt-6 pb-1 text-h6">
      {{product.name}}
    </v-card-subtitle>

    <v-card-text>
      <div>{{product.description}}</div>
    </v-card-text>

    <v-card-actions>
      <div>
        <v-card-subtitle class="text-h7">
          {{product.price}}€
        </v-card-subtitle></div>
      <v-spacer></v-spacer>
      <v-btn color="orange" @click="addToCart(product)">
        Add to cart
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.cardheight {
  height: 100%;
}

.photoPosition {
  width: 180px;
  align-self: center;
}

.price {
  position: absolute;
  bottom: 25px;
}

.buttonRight {
  float: right;
}
</style>