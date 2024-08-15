<template>
  <div>
    <NuxtLink to="/" class="bg-blue-500 hover:bg-blue-600 transition duration-200 text-white text-center rounded-lg px-4 py-2 mb-12 inline-block">Go Back</NuxtLink>
    <div class="flex justify-between items-center gap-4 flex-wrap mb-12">
        <h1 class="text-4xl font-semibold">{{ data.survey.name }}</h1>
        <div 
            :class="{ 'bg-green-500': data.survey.status === 'active', 'bg-red-500': data.survey.status === 'closed'  }" 
            class="text-white py-2 px-4 rounded-lg"
        >
            {{ data.survey.status }}
        </div>
    </div>
    <div v-if="error" class="bg-red-200 rounded-lg px-8 py-4 mb-8">
        <h3 class="text-red-800 text-lg">{{ error.data.statusMessage }}</h3>
    </div>
    <div v-if="success" class="bg-green-200 rounded-lg px-8 py-4 mb-8">
        <h3 class="text-green-800 text-lg">
            Answers successfully submitted.
            <NuxtLink to="/" class="underline">Return to home page</NuxtLink>
        </h3>
    </div>
    <form @submit.prevent="onSubmit" v-if="data.survey.status === 'active'">
        <div class="flex flex-col gap-2 mb-8" v-for="question in data.questions" :key="question.id">
            <h2 class="text-2xl font-semibold mb-2">{{ question.name }}</h2>
            <div class="flex flex-col gap-2">
                <div v-for="answer in question.answers" :key="answer.id">
                    <div class="border-2 border-gray-200 rounded-lg px-4 py-2 flex items-center flex-wrap gap-2">
                        <input 
                            type="checkbox" 
                            v-model="checkedAnswers" 
                            :id="answer.id" 
                            :value="{ questionId: question.id, name: answer.name, answerId: answer.id }"
                        />
                        <label :for="answer.id" class="select-none">{{ answer.name }}</label>
                    </div>
                </div>
            </div>
        </div>
        <button 
            :disabled="loading" 
            type="submit" 
            class="bg-blue-500 hover:bg-blue-600 transition duration-200 text-white text-center rounded-lg px-8 py-2 disabled:bg-opacity-50"
        >
            Submit answers
        </button>
    </form>
    <div v-if="data.survey.status === 'closed'">
        <div v-for="question in data.summary" :key="question.id">
            <h2 class="text-2xl font-semibold mb-2">{{ question.question }}</h2>
            <ul class="flex flex-col gap-2 mb-8">
                <li v-for="vote in question.votes" :key="vote.id">
                    {{ vote.name }}: {{ Math.floor((vote.votesCount / data.totalVotes) * 100) }}%
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import type { RequestFail, Survey, SurveysGetRequest } from "~/types/api";

    const route = useRoute();
    const checkedAnswers = ref<{ questionId: string, name: string, answerId: string }[]>([]);
    const loading = ref<boolean>(false);
    const success = ref<boolean>(false);
    const error = ref<RequestFail|null>(null);

    const { data: cachedSurveys } = useNuxtData<SurveysGetRequest>('surveys');

    const { data } = await useFetch(`/api/surveys/${route.params.id}`, {
        key: `survey-${route.params.id}`,
        default() { 
            if (cachedSurveys.value) {
                return cachedSurveys.value.surveys.find((survey: Survey) => survey._id === route.params.id);
            }
        },
    });

    async function onSubmit() {
        try {
            success.value = false;
            error.value = null;
            loading.value = true;
            await $fetch(`/api/votes/${route.params.id}`, {
                method: 'POST',
                body: {
                    answers: checkedAnswers.value,
                    questions: data.value?.questions,
                }
            });
            success.value = true;
        } catch (err) {
            const serverError = err as RequestFail;
            error.value = serverError;
        } finally {
            loading.value = false;
        }
    }
</script>