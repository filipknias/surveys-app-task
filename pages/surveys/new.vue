<template>
  <div>
    <h1 class="text-4xl font-bold mb-12">Create new survey</h1>
    <form @submit.prevent="onSubmit">
        <div class="flex flex-col gap-2 mb-8">
            <label for="name" class="text-xl">Name</label>
            <input 
                type="text" 
                id="name" 
                class="border rounded-lg px-4 py-2" 
                placeholder="Provide name" 
                required
                v-model="name"
            />
        </div>
        <div class="flex flex-col gap-2 mb-8" v-for="(answer, index) in answers" :key="answer.id">
            <label :for="answer.id" class="text-xl">Answer #{{ index + 1 }}</label>
            <div class="flex flex-wrap gap-4">
                <input 
                    type="text" 
                    :id="answer.id" 
                    v-model="answer.name" 
                    class="border rounded-lg px-4 py-2 flex-1" 
                    placeholder="Provide answer" 
                    required
                />
                <button class="bg-red-500 hover:bg-red-600 transition duration-200 text-white text-center rounded-lg px-4 py-2 disabled:bg-opacity-50" :disabled="index < 3" @click="deleteAnswer(answer.id)">
                    Delete
                </button>
            </div>
        </div>
        <div v-if="error" class="bg-red-200 rounded-lg px-8 py-4 mb-8">
            <h1 class="text-red-500 text-xl">
                {{ error.statusMessage }} ({{ error.statusCode }}). Please try again
            </h1>
        </div>
        <div class="flex flex-wrap gap-4">
            <button @click="addAnswer" :disabled="loading" type="button" class="bg-green-500 hover:bg-green-600 transition duration-200 text-white text-center rounded-lg px-8 py-2 disabled:bg-opacity-50">Add answer</button>
            <button :disabled="loading" type="submit" class="bg-blue-500 hover:bg-blue-600 transition duration-200 text-white text-center rounded-lg px-8 py-2 disabled:bg-opacity-50">Submit survey</button>
        </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
    import { nanoid } from 'nanoid';
    import type { SurveysPostRequest, RequestFail } from '~/types/api'

    const initialAnswers = [
        { id: nanoid(), name: "" },
        { id: nanoid(), name: "" },
        { id: nanoid(), name: "" },
    ];
    const answers = ref<{ id: string, name: string }[]>(initialAnswers);
    const name = ref<string>("");
    const loading = ref<boolean>(false);
    const error = ref<RequestFail|null>(null);

    async function onSubmit() {
        try {
            loading.value = true;
            const surveyRequest = await $fetch<SurveysPostRequest>('/api/surveys', {
                method: 'POST',
                body: {
                    name: name.value,
                    answers: answers.value,
                }
            });
            
            await navigateTo(`/surveys/${surveyRequest.id}`);
        } catch (err) {
            const serverError = err as RequestFail;
            error.value = serverError;
        } finally {
            loading.value = false;
        }
    }

    function addAnswer() {
        answers.value.push({
            id: nanoid(),
            name: "",
        });
    }

    function deleteAnswer(id: string) {
        answers.value = answers.value.filter(answer => answer.id !== id);
    }
</script>  