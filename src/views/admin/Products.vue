<script setup>
import { ref } from 'vue';
import ProductsList from '../../components/admin/product/ProductsList.vue';
import ProductCreate from '../../components/admin/product/ProductCreate.vue';
import ProductEdit from '../../components/admin/product/ProductEdit.vue';

const createProduct = ref(false);
const editProduct = ref(false);
const editingProduct = ref({})

const createProductChange = (value) => {
    createProduct.value = value
}
const editProductChange = (value) => {
    editProduct.value = value
}
const editingProductChange = (product) => {
    editingProduct.value = product
}

</script>
    
<template>
    <ProductsList v-if="!createProduct && !editProduct" @createProductChange="createProductChange" @editProductChange="editProductChange" @editingProductChange="editingProductChange"></ProductsList>
    <ProductCreate v-if="createProduct" @createProductChange="createProductChange"></ProductCreate>
    <ProductEdit v-if="editProduct" @editProductChange="editProductChange" :product="editingProduct"></ProductEdit>
</template>