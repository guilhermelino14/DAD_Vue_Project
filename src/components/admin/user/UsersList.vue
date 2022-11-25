<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import axios from 'axios';

const users = ref([]);
let page = ref(1);
let maxPage = ref(9);

const emit = defineEmits(['createUserChange', 'editUserChange', 'editingUserChange'])

onMounted(() => {
    userList();
});

const userList = () => {
    axios.get(import.meta.env.VITE_API_URL + '/user?page=' + page.value)
        .then(response => {
            users.value = response.data.data;
            maxPage.value = response.data.last_page;
        })
        .catch(error => {
            console.log(error);
        });
};

const changepage = () => {
    userList();
};

const createUser = () => {
    emit('createUserChange', true)
}

const editUser = (user) => {
    emit('editUserChange', true)
    emit('editingUserChange', user)
}



const deleteUser = (userID) => {
    axios.delete(import.meta.env.VITE_API_URL + '/user/' + userID)
        .then(response => {
            userList();
        })
        .catch(error => {
            console.log(error);
        });
}

</script>
    
<template>
    <v-col class="text-right">
        <v-btn color="primary" @click="createUser">Add User</v-btn>
    </v-col>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">
                    Name
                </th>
                <th class="text-left">
                    email
                </th>
                <th class="text-left">
                    type
                </th>
                <th class="text-left">
                    blocked
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in users" :key="user">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.type }}</td>
                <td v-if="user.blocked">
                    <v-icon icon="mdi-check"></v-icon>
                </td>
                <td v-if="!user.blocked">
                    <v-icon icon="mdi-cancel"></v-icon>
                </td>
                <td>
                    <v-btn icon="mdi-pencil" color="info" size="x-small" @click="editUser(user)"></v-btn>
                    <v-btn icon="mdi-delete" color="error" size="x-small" @click="deleteUser(user.id)"></v-btn>
                </td>

            </tr>
        </tbody>
    </v-table>
    <div class="text-center">
        <v-pagination v-model="page" :length="maxPage" @click="changepage"></v-pagination>
    </div>

</template>