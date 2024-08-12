<template>
    <div class="border border-gray-200 rounded-lg">
        <button 
            v-for="index in props.totalPages" 
            :key="index" 
            class="py-2 px-4 transition"
            :class="{ 'bg-blue-500 hover:bg-blue-600 text-white': currentPage === index, 'bg-white hover:bg-gray-100': currentPage !== index }"
            @click="onPageChange(index)"
        >
            {{ index }}
        </button>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        currentPage: { type: Number, required: true },
        totalPages: { type: Number, required: true },
        onPageChange: { type: Function, required: true },
    });
</script>