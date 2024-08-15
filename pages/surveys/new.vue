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
        <div class="flex flex-col gap-2 mb-8" v-for="(question, index) in questions" :key="question.id">
            <label :for="question.id" class="text-xl">Question #{{ index + 1 }}</label>
            <div class="flex flex-wrap gap-4 mb-2">
                <input 
                    type="text" 
                    :id="question.id" 
                    v-model="question.name" 
                    class="border rounded-lg px-4 py-2 flex-1" 
                    placeholder="Provide question" 
                    required
                />
                <button 
                    type="button" 
                    class="bg-blue-500 hover:bg-blue-600 transition duration-200 text-white text-center rounded-lg px-4 py-2 disabled:bg-opacity-50" 
                    @click="addAnswer(question.id)"
                >
                    Add answer
                </button>
                <button 
                    type="button" 
                    class="bg-red-500 hover:bg-red-600 transition duration-200 text-white text-center rounded-lg px-4 py-2 disabled:bg-opacity-50" 
                    :disabled="index < 3" 
                    @click="deleteQuestion(question.id)"
                >
                    Delete question
                </button>
            </div>
            <ul class="list-decimal pl-12 flex flex-col gap-3">
                <li v-for="(answer, index) in question.answers" :key="answer.id">
                    <div class="flex flex-wrap items-center gap-4">
                        <input 
                            type="text" 
                            v-model="answer.name" 
                            class="border rounded-lg px-4 py-2 flex-1" 
                            placeholder="Answer..." 
                            required
                        />
                        <button 
                            type="button" 
                            class="bg-red-500 hover:bg-red-600 transition duration-200 text-white text-center rounded-full w-10 h-10 flex items-center justify-center disabled:bg-opacity-50" 
                            :disabled="index < 1"
                            @click="deleteAnswer(question.id, answer.id)"
                        >
                            <svg width="24" height="24" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="error" class="bg-red-200 rounded-lg px-8 py-4 mb-8">
            <h1 class="text-red-500 text-xl">
                {{ error.message }} ({{ error.statusCode }}). Please try again
            </h1>
        </div>
        <div class="flex flex-wrap gap-4">
            <button @click="addQuestion" :disabled="loading" type="button" class="bg-green-500 hover:bg-green-600 transition duration-200 text-white text-center rounded-lg px-8 py-2 disabled:bg-opacity-50">Add question</button>
            <button :disabled="loading" type="submit" class="bg-blue-500 hover:bg-blue-600 transition duration-200 text-white text-center rounded-lg px-8 py-2 disabled:bg-opacity-50">Submit survey</button>
        </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
    import { nanoid } from 'nanoid';
    import { INITIAL_QUESTIONS } from '~/data/constants';
    import type { SurveysPostRequest, RequestFail, Question } from '~/types/api'

    const questions = ref<Question[]>(INITIAL_QUESTIONS);
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
                    questions: questions.value,
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

    function addQuestion() {
        questions.value.push({
            id: nanoid(),
            name: "",
            answers: [{ id: nanoid(), name: "" }],
        });
    }

    function deleteQuestion(id: string) {
        questions.value = questions.value.filter(question => question.id !== id);
    }

    function deleteAnswer(questionId: string, answerId: string) {
        questions.value = questions.value.map((question) => {
            if (question.id !== questionId) return question;
            const newOptions = question.answers.filter((answer) => answer.id !== answerId);
            return {
                ...question,
                answers: newOptions,
            }
        });
    }

    function addAnswer(questionId: string) {
        questions.value = questions.value.map((question) => {
            if (question.id !== questionId) return question;
            return {
                ...question,
                answers: [
                    ...question.answers, 
                    { id: nanoid(), name: "" }
                ],
            }
        });
    }
</script>  