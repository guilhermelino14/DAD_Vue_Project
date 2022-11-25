<script setup>
import { ref } from 'vue';
import UsersList from '@/components/admin/user/UsersList.vue';
import UserCreate from '@/components/admin/user/UserCreate.vue';
import UserEdit from '../../components/admin/user/UserEdit.vue';

const createUser = ref(false);
const editUser = ref(false);
const editingUser = ref({})

const createUserChange = (value) => {
    createUser.value = value
}

const editUserChange = (value) => {
    editUser.value = value
}

const editingUserChange = (user) => {
    editingUser.value = user
}


</script>

<template>
    <UsersList v-if="!createUser && !editUser" @createUserChange="createUserChange" @editUserChange="editUserChange" @editingUserChange="editingUserChange"></UsersList>
    <UserCreate v-if="createUser" @createUserChange="createUserChange"></UserCreate>
    <UserEdit v-if="editUser" @editUserChange="editUserChange" :user = "editingUser"></UserEdit>
</template>