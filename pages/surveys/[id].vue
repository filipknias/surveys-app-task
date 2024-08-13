<template>
  <div>
    <div class="flex justify-between items-center gap-4 flex-wrap mb-12">
        <h1 class="text-4xl font-semibold">{{ data.survey.name }}</h1>
        <div :class="statusBadgeBackground" class="text-white py-2 px-4 rounded-lg">{{ data.survey.status }}</div>
    </div>
    <div v-if="error" class="bg-red-200 rounded-lg px-8 py-4 mb-8">
        <h3 class="text-red-800 text-lg">{{ error.data.statusMessage }}</h3>
    </div>
    <form @submit.prevent="onSubmit">
        <div class="flex flex-col gap-2 mb-8" v-for="question in data.questions" :key="question.id">
            <h2 class="text-2xl font-semibold mb-2">{{ question.name }}</h2>
            <div class="flex flex-col gap-2">
                <div v-for="answer in question.answers" :key="answer.id">
                    <div 
                        class="border-2 border-gray-200 rounded-lg px-4 py-2 flex items-center flex-wrap gap-2"
                        :class="{ 'border-blue-500': checkedAnswers.includes(answer.id) }"
                    >
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
        <button :disabled="postStatus === ''" type="submit" class="bg-blue-500 hover:bg-blue-600 transition duration-200 text-white text-center rounded-lg px-8 py-2 disabled:bg-opacity-50">Submit answers</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
    import type { SurveyIdGetRequest } from "~/types/api";

    const route = useRoute();
    const checkedAnswers = ref<{ questionId: string, name: string, answerId: string }[]>([]);

    const { data, status } = await useFetch<SurveyIdGetRequest>(`/api/surveys/${route.params.id}`);

    const statusBadgeBackground = reactive({
        'bg-green-500': data.value?.survey.status === "active",
    });

    const { execute, status: postStatus, error, data: votesData } = await useFetch(`/api/votes/${route.params.id}`, {
        immediate: false,
        method: "POST",
        body: {
            answers: checkedAnswers.value,
        },
    });

    async function onSubmit() {
        execute();
    }
</script>