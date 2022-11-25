<script setup>
import axios from 'axios';
import { defineEmits, ref } from 'vue';

const emit = defineEmits(['createUserChange'])


const userList = () => {
    emit('createUserChange', false)
}

// const items = ref(
//     { type: 'C', name: 'Customer' },
//     { type: 'EC', name: 'Employee Chef' },
//     { type: 'ED', name: 'Employee Delivery' },
//     { type: 'EM', name: 'Employee Manager' }
// )

const user = ref({
    name: '',
    email: '',
    password: '',
    type: '',
})

const createUserPost = () => {
    axios.post(import.meta.env.VITE_API_URL + '/user', user.value)
        .then(response => {
            console.log(response)
            userList()
        })
        .catch(error => {
            console.log(error)
        })
}

</script>

<template>

    <v-col class="text-left">
        <v-btn icon="mdi-chevron-left" color="info" @click="userList"></v-btn>
    </v-col>
    <h3>Create User</h3>
    
    <v-card>
        <v-container>
            <v-form ref="form" lazy-validation>
                <v-text-field v-model="user.name" label="Name" required></v-text-field>

                <v-text-field v-model="user.email" label="E-mail" required></v-text-field>

                <v-text-field v-model="user.password" type="password" label="Password" required></v-text-field>

                <v-select v-model="user.type" :items="['C', 'EC', 'ED', 'EM']" item-title="item"
                    item-value="item" label="Select" required></v-select>

                <v-btn color="success" @click="createUserPost" class="text-right">
                    Create User
                </v-btn>
            </v-form>
        </v-container>
    </v-card>
</template>