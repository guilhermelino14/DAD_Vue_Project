import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import AdminHome from '@/views/admin/Home.vue'
import AdminUsers from '@/views/admin/Users.vue'
import AdminProducts from '@/views/admin/Products.vue'
import AdminOrders from '@/views/admin/Orders.vue'
import UserOrders from '@/views/UserOrders.vue'
import Cart from '@/views/Cart.vue'
import CartPayment from '@/views/CartPayment.vue'
import PublicBoard from '@/views/PublicBoardView.vue'
import Statistics from '@/views/Statistics.vue'
import AdminStatistics from '@/views/admin/Statistics.vue'

import { useUserStore } from '@/stores/user.js';
import { cartStore } from '@/stores/cart.js';

const verifyIsNotCostumer = (to, from, next) => {
  const storeUser = useUserStore();
  const config = {
    headers: {
      'Content-Type': "application/json",
      Authorization: "Bearer " + storeUser.token,
    },
  };
  axios.get(import.meta.env.VITE_API_URL + '/userType', config).then((res) => {
    if (res.data.type != 'C') next();
    else next('/');
  });
}
const verifyIfUserIsMenager = (to, from, next) => {
  const storeUser = useUserStore();
  const config = {
    headers: {
      'Content-Type': "application/json",
      Authorization: "Bearer " + storeUser.token,
    },
  };
  axios.get(import.meta.env.VITE_API_URL + '/userType', config).then((res) => {
    if (res.data.type == 'EM') next();
    if (res.data.type == 'C') next('/');
    else next('/admin');
  });
}
const verifyIfUserIsChefOrDeliver = (to, from, next) => {

  const storeUser = useUserStore();
  const config = {
    headers: {
      'Content-Type': "application/json",
      Authorization: "Bearer " + storeUser.token,
    },
  };
  axios.get(import.meta.env.VITE_API_URL + '/userType', config).then((res) => {
    if (res.data.type == 'EC' || res.data.type == 'ED' || res.data.type == 'EM') next();
    if (res.data.type == 'C') next('/');
    else next('/admin');
  });
}

const userLogged = (to, from, next) => {
  const storeUser = useUserStore();
  if (!storeUser.islogged) next();
  else next('/');
}

const userNotLogged = (to, from, next) => {
  const storeUser = useUserStore();
  if (storeUser.islogged) next();
  else next('/');
}
const isLoggedAndItsACostumer = (to, from, next) => {
  const storeUser = useUserStore();
  if(!storeUser.islogged){
    next('/login');
  }
  const config = {
    headers: {
      'Content-Type': "application/json",
      Authorization: "Bearer " + storeUser.token,
    },
  };
  axios.get(import.meta.env.VITE_API_URL + '/userType', config).then((res) => {
    if (res.data.type == 'C') next();
    else next('/');
  });
}

const cartEmpty = (to, from, next) => {
  const storeCart = cartStore();
  if (storeCart.getCartCount != 0) next()
  else next('/');
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'menu',
      component: () => import('../views/MenuView.vue')
    },
    {
      path: '/publicBoard',
      name: 'publicBoard',
      component: PublicBoard
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: userLogged,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      beforeEnter: userLogged,
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
    },
    {
      path: '/cart-payment',
      name: 'cartPayment',
      component: CartPayment,
      beforeEnter: cartEmpty,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: userNotLogged,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: Statistics,
      beforeEnter: isLoggedAndItsACostumer,
    },
    {
      path: '/order-history',
      name: 'order-history',
      component: UserOrders,
      beforeEnter: isLoggedAndItsACostumer,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminHome,
      beforeEnter: verifyIfUserIsChefOrDeliver,
      meta: {
        hideNavbar: true,
      }
    },
    {
      path: '/admin/users',
      name: 'adminUsers',
      component: AdminUsers,
      beforeEnter: verifyIfUserIsMenager,
      meta: {
        hideNavbar: true,
      }
    },
    {
      path: '/admin/products',
      name: 'adminProducts',
      component: AdminProducts,
      beforeEnter: verifyIfUserIsMenager,
      meta: {
        hideNavbar: true,
      }
    },
    {
      path: '/admin/orders',
      name: 'adminOrders',
      component: AdminOrders,
      beforeEnter: verifyIfUserIsMenager,
      meta: {
        hideNavbar: true,
      }
    },
    {
      path: '/admin/statistics',
      name: 'adminStatistics',
      component: AdminStatistics,
      beforeEnter: verifyIfUserIsMenager,
      meta: {
        hideNavbar: true,
      }
    }
  ]
})

export default router
