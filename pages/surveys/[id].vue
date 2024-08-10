<template>
  <div>
    <h1>{{ data.survey }}</h1>
    <div class="flex justify-between items-center gap-4 flex-wrap mb-12">
        <h1 class="text-4xl font-semibold">{{ data.name }}</h1>
        <div :class="statusBadgeBackground" class="text-white py-2 px-4 rounded-lg">{{ data.status }}</div>
    </div>
    <div v-if="error" class="bg-red-200 rounded-lg px-8 py-4 mb-8">
        <h3 class="text-red-800 text-lg">{{ error.data.statusMessage }}</h3>
    </div>
    <form @submit.prevent="onSubmit">
        <div class="flex flex-col gap-2 mb-8" v-for="answer in answers" :key="answer.id">
            <label :for="answer.id" class="text-xl">{{ answer.name }}</label>
            <input 
                type="text" 
                :id="answer.id" 
                v-model="answer.value" 
                class="border rounded-lg px-4 py-2 flex-1" 
                placeholder="Provide answer" 
                required
            />
        </div>
        <button :disabled="postStatus === ''" type="submit" class="bg-blue-500 hover:bg-blue-600 transition duration-200 text-white text-center rounded-lg px-8 py-2 disabled:bg-opacity-50">Submit answers</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
    import type { Survey } from "~/types/api";

    const route = useRoute();
    const answers = ref<{ id: string; value: string, name: string; }[]>([]);

    const { data, status } = await useFetch<Survey>(`/api/surveys/${route.params.id}`);

    if (data.value?.answers) {
        answers.value = data.value?.answers.map((answer) => {
            return { id: answer.id, value: "", name: answer.name };
        });
    }

    const statusBadgeBackground = reactive({
        'bg-green-500': data.value?.status === "active",
    });

    const { execute, status: postStatus, error, data: votesData } = await useFetch(`/api/votes/${route.params.id}`, {
        immediate: false,
        method: "POST",
        body: {
            answers: answers.value.map((answer) => {
                return { id: answer.id, value: answer.value };
            }),
        },
    });

    async function onSubmit() {
        execute();
    }
</script>