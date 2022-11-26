<script setup>
import axios from 'axios';
import { defineEmits, ref,defineProps} from 'vue';

const emit = defineEmits(['editUserChange'])
const props = defineProps(['user'])
const user = props.user

const alert = ref(null)

const userList = () => {
    emit('editUserChange', false)
}


const createUseredit = () => {
    axios.put(import.meta.env.VITE_API_URL + '/users/' + user.id, user)
        .then(response => {
            alert.value = response.data.message
            //userList();
        })
        .catch(error => {
            console.log(error);
        });
}

</script>

<template>

    <v-col class="text-left">
        <v-btn icon="mdi-chevron-left" color="info" @click="userList"></v-btn>
    </v-col>
    <h3>Edit User</h3>
    <v-alert v-if="alert != null" type="success">{{alert}}</v-alert>
    <v-card>
        <v-container>
            <v-form ref="form" lazy-validation>
                <v-text-field v-model="user.name" label="Name" required></v-text-field>

                <v-text-field v-model="user.email" label="E-mail" required></v-text-field>

                <v-text-field v-model="user.password" type="password" label="Password" required></v-text-field>

                <v-select v-model="user.blocked" :items="['1', '0']" item-title="item"
                    item-value="item" label="blocked" required></v-select>

                <v-select v-model="user.type" :items="['C', 'EC', 'ED', 'EM']" item-title="item"
                    item-value="item" label="Select" required></v-select>

                <v-btn color="success" @click="createUseredit" class="text-right">
                    Edit User
                </v-btn>
            </v-form>
        </v-container>
    </v-card>
</template>