<script setup>
import { ref, defineProps, computed } from 'vue';
const props = defineProps(['order'])

const show = ref(0);

const api = ref(import.meta.env.VITE_API_URL);

const showOrderItems = (id) => {
    if (show.value == 0) {
        show.value = id;
    } else {
        show.value = 0;
    }
};

const convertCreatedAtToDate = (date) => {
    let created = new Date(date);
    return created.toLocaleDateString() + ' ' + created.toLocaleTimeString();
};
</script>
<template>
    <v-card>
        <template v-slot:prepend>
            <v-card-item>
                <v-card-title class="mb-5">Order Number {{ order.id }}</v-card-title>

                <v-card-subtitle>Order Date {{ convertCreatedAtToDate(order.created_at) }}</v-card-subtitle>
            </v-card-item>
            <v-card-text>
                Total: <span style="color: green;">{{ order.total_price }} €</span>
            </v-card-text>
        </template>
        <template v-slot:append>
            <div class="justify-self-end">
                <div class="box" :class="order.status">
                    {{ order.status }}
                </div>
            </div>
        </template>
        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn icon @click="showOrderItems(order.id)">
                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
            
        </v-card-actions>
        <v-expand-transition>
            <div v-show="show == order.id">
                <v-divider></v-divider>
                <v-card-text>
                    <v-card-item v-for="item in order.order_items" >
                        <v-row>
                            <v-col md="3">
                                <v-img :src="api+'/products/photo/' +item.product.photo_url " class="img_size_photo"></v-img>
                            </v-col>
                            <v-col md="9">
                                <v-card-title class="mb-5">{{item.product.name}}</v-card-title>
                                <v-card-subtitle>Price: {{ item.product.price }} €</v-card-subtitle>
                                <div class="box" :class="item.status">{{ item.status }}</div>
                            </v-col>
                        </v-row>
                    </v-card-item>
                    
                </v-card-text>

            </div>
        </v-expand-transition>

    </v-card>
</template>

<style scoped>
.box {
    border: 1px solid transparent;
    padding: 10px;
    margin: 10px;
}
.Preparing{
    background: rgba(255,193,7,20%);
    color: #FFC107;
}
.Ready {
    background: rgba(112, 217, 158, 20%);
    color: #4e9645;
}
.Cancelled {
    background: rgba(248,1,1,20%);
    color: #f80101;
}
.Delivered{
    background: hsla(223, 93%, 60%, 0.2);
    color: #307ffc;
}
.Waiting {
    background: rgba(255,193,7,20%);
    color: #FFC107;
}
.img_size_photo {
    width: 100%;
    height: auto;
}
</style>