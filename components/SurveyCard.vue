<template>
    <NuxtLink :to="`/surveys/${props.id}`">
        <div class="border border-gray-200 rounded-lg p-4 group">
            <div class="flex items-center justify-between flex-wrap mb-4">
                <h2 class="text-2xl font-semibold group-hover:underline">{{ props.name }}</h2>
                <div 
                    class="text-white py-2 px-4 rounded-lg"
                    :class="{ 'bg-green-500': props.status === 'active', 'bg-red-500': props.status === 'closed'  }" 
                >
                    {{ props.status }}
                </div>
            </div>
            <p class="font-medium text-lg">
                {{ props.votesCount }} Votes
            </p>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
    const props = defineProps({
        id: { type: String, required: true },
        name: { type: String, required: true },
        status: { type: String, required: true },
        votesCount: { type: Number, required: true },
    });
</script>