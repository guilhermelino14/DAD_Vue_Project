<script setup>
import { ref, onMounted, computed, defineProps } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        required: true
    }
});
</script>

<template>
    <v-card class="mx-auto" max-width="344" style="text-align-last: center;">
        <v-card-text>
            <div>{{ props.title }}</div>
            <p class="text-h4 text--primary">
                {{ props.value }}
            </p>
        </v-card-text>
    </v-card>
</template>