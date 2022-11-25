<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter();

const storeUser = useUserStore();
const drawer = ref(false)
const items = ref([
    { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/admin/', name: 'admin', show: true },
    { title: 'Users', icon: 'mdi-account-multiple', route: '/admin/users', name: 'adminUsers', show: true },
    { title: 'Products', icon: 'mdi-book', route: '/admin/products', name: 'adminProducts', show: true },
    { title: 'Orders', icon: 'mdi-glass-cocktail', route: '/admin/orders', name: 'adminOrders', show: true },
])

const logout = () => {
    storeUser.logout()
    router.push('/')
}

onMounted(() => {
    const config = {
        headers: {
            'Content-Type': "application/json",
            Authorization: "Bearer " + storeUser.token,
        },
    };
    axios.get(import.meta.env.VITE_API_URL + '/userType', config)
        .then((res) => {
            if (res.data.type == 'EC' || res.data.type == 'ED') {
                items.value[1].show = false
                items.value[2].show = false
            }
        })

})

</script>
<template>
    <v-app>
        <v-app-bar clipped-left>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-spacer></v-spacer>

            <div class="pr-2">{{ storeUser.user.name }}</div>


            <!-- <v-btn icon>
                <v-avatar>
                    <v-img :src="'http://localhost:80/api/user/photo/' + userStore.user.photo_url" alt="John"></v-img>
                </v-avatar>
            </v-btn> -->

            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" icon>
                        <v-avatar>
                            <v-img :src="'http://localhost:80/api/user/photo/' + storeUser.user.photo_url" alt="John">
                            </v-img>
                        </v-avatar>
                    </v-btn>
                    <v-badge color="red" :content="0" class="mr-3">
                        <v-btn color="primary" icon >
                            <v-avatar>
                                <v-icon>mdi-bell</v-icon>
                            </v-avatar>
                        </v-btn>
                    </v-badge>

                </template>
                <v-list>
                    
                    <v-list-item link @click="$router.push('/')">
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item>
                    <v-list-item link @click="$router.push('/profile')">
                        <v-list-item-title>Profile</v-list-item-title>
                    </v-list-item>
                    <v-list-item link>
                        <v-list-item-title @click="logout">Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>


        </v-app-bar>
        <v-navigation-drawer v-model="drawer" expand-on-hover clipped>
            <v-list density="compact" nav v-for="item in items">
                <v-list-item @click="$router.push(item.route)" :prepend-icon="item.icon" :title="item.title"
                    :class="{ 'active': $route.name == item.name }" :value="item.title" v-show="item.show">
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container>
                <RouterView />
            </v-container>
        </v-main>
    </v-app>
</template>