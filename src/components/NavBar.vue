<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { cartStore } from '@/stores/cart'

const api = import.meta.env.VITE_API_URL

const storeCart = cartStore();

const storeUser = useUserStore();


const router = useRouter();

const loginRoute = () => {
  router.push('/login');
}

const RegisterRoute = () => {
  router.push('/register');
}

const profileRoute = () => {
  router.push('/profile');
}

const OrderHistoryRoute = () => {
  router.push('/order-history');
}

const cartRoute = () => {
  router.push('/cart');
}

const AdminRoute = () => {
  router.push('/admin');
}

const logout = () => {
  storeUser.logout();
  router.push('/');
}


</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light" style="    margin-left: 0rem;margin-top: 0rem;">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
      aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse " id="navbarTogglerDemo01">
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        <li class="nav-item active">
          <RouterLink class="nav-link" to="/">Home</RouterLink>

        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/publicBoard">Public Board</RouterLink>
        </li>
      </ul>
    </div>

    <div class="d-flex" v-if="storeUser.islogged">
      <div class="p-3 clienteName">
        {{ storeUser.getUser.name }}
      </div>
      <div class="p-2 dropleft">
        <v-btn icon id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <v-avatar>
            <v-img :src="api + '/users/photo/' + storeUser.user.photo_url" alt="John"></v-img>
          </v-avatar>
        </v-btn>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item" v-if="storeUser.user.type != 'C'" @click="AdminRoute">Admin</a>
          <a class="dropdown-item" @click="profileRoute">Profile</a>
          <a class="dropdown-item" v-if="storeUser.user.type == 'C'" @click="OrderHistoryRoute">Order History</a>
          <a class="dropdown-item" @click="logout">Log Out</a>
        </div>
        <v-badge color="green" :content="storeCart.getCartCount">
          <v-btn icon class="ml-2" @click="cartRoute">
            <v-avatar>
              <v-icon dark left>
                mdi-cart
              </v-icon>
            </v-avatar>
          </v-btn>
        </v-badge>
      </div>
    </div>
    <div class="d-flex" v-if="!storeUser.islogged">
      <div class="p-2">
        <button type="button" class="btn btn-outline-primary" @click="loginRoute">Login</button>
      </div>
      <div class="p-2">
        <button type="button" class="btn btn-primary" @click="RegisterRoute">Register</button>
      </div>
      <v-badge color="green" :content="storeCart.getCartCount">
          <v-btn icon class="ml-2" @click="cartRoute">
            <v-avatar>
              <v-icon dark left>
                mdi-cart
              </v-icon>
            </v-avatar>
          </v-btn>
        </v-badge>
    </div>
  </nav>
</template>

<style scoped>
.logo {
  width: 60px;
  height: auto;
}

.clienteName {
  top: 3px;
  position: relative;
}
</style>