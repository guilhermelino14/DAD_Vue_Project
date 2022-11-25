<script setup>
import axios from 'axios';
import { defineEmits, ref,defineProps} from 'vue';

const emit = defineEmits(['editOrderChange'])
const props = defineProps(['order'])
const order = props.order

const alert = ref(null)

const orderList = () => {
    emit('editOrderChange', false)
}


const createOrderEdit = () => {
    axios.put(import.meta.env.VITE_API_URL + '/orders/' + order.id, order)
        .then(response => {
            alert.value = response.data.message
            //orderList();
        })
        .catch(error => {
            console.log(error);
        });
    }

</script>

<template>

    <v-col class="text-left">
        <v-btn icon="mdi-chevron-left" color="info" @click="orderList"></v-btn>
    </v-col>
    <h3>Edit Order</h3>
    <v-alert v-if="alert != null" type="success">{{alert}}</v-alert>
    <v-card>
        <v-container>
            <v-form ref="form" lazy-validation>
                <v-select v-model="order.status" :items="['Preparing', 'Ready', 'Delivered', 'Canceled']" item-title="item"
                          item-value="item" label="Status" required></v-select>

                <v-text-field v-model="order.custom" label="Motive" required :disabled="order.status != 'Canceled'"></v-text-field>

                <v-btn color="success" @click="createOrderEdit" class="text-right">
                    Edit Order
                </v-btn>
            </v-form>
        </v-container>
    </v-card>
</template>