<template>
    <div>
        <div v-if="error" class="bg-red-200 rounded-lg px-8 py-4 mb-8">
            <h1 class="text-red-500 text-xl">
                {{ error.message }} ({{ error.statusCode }}). Please try again
            </h1>
        </div>
        <div class="mb-8">
            <label for="name" class="mb-2 block font-semibold text-lg">Find by name</label>
            <input type="text" id="name" v-model="name" class="border rounded-lg px-4 py-2 w-full" placeholder="Name..." />
        </div>
        <div v-if="data">
            <div v-if="data.surveys.length === 0" class="bg-blue-200 rounded-lg px-8 py-4 mb-8">
                <h1 class="text-blue-500 text-xl">No surveys found</h1>
            </div>
            <div class="flex flex-wrap -m-4 mb-12">
                <div class="w-full lg:w-1/3 p-4" v-for="survey in data.surveys" :key="survey._id">
                    <SurveyCard
                        :id="survey._id"
                        :name="survey.name"
                        :status="survey.status"
                        :votesCount="votesCount[survey._id] !== undefined ? votesCount[survey._id] : survey.votesCount"
                    />
                </div>
            </div>
            <div class="flex justify-center">
                <Pagination 
                    :currentPage="parseInt(data.pagination.currentPage)" 
                    :totalPages="parseInt(data.pagination.totalPages)"
                    :onPageChange="handlePageChange"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import type { SurveysGetRequest, VotesCountGetRequest } from "~/types/api";
    import { PER_PAGE, TIMER_INTERVAL } from "~/data/constants";
    import { debounce } from 'lodash';

    const route = useRoute()
    const router = useRouter()
    const name = ref(route.query.name);
    const query = computed(() => ({ 
        page: route.query.page, 
        per_page: PER_PAGE, 
        name: route.query.name 
    }));
    const timer = ref<NodeJS.Timeout|null>(null);
    const votesCount = ref<Record<string, number>>({});

    useHead({ title: "Surveys List" });

    const { data, error } = await useFetch<SurveysGetRequest>('/api/surveys', {
        key: 'surveys',
        query, 
        onResponse({ response }) {
            const data = response._data as SurveysGetRequest;
            votesCount.value = data.surveys.reduce((acc, survey) => {
                return { ...acc, [survey._id]: survey.votesCount };
            }, {});
        }, 
    });

    const votesCountRequest = await useFetch<VotesCountGetRequest>('/api/votes/count', {
        onResponse({ response }) {
            const votesCountResponse = response._data as VotesCountGetRequest;
            votesCount.value = votesCountResponse.votes.reduce((acc, vote) => {
                return { ...acc, [vote.surveyId]: vote.votesCount };
            }, {});
        }
    });
    
    async function handlePageChange(page: number) {
        await navigateTo({ 
            path: "/", 
            query: { page, name: route.query.name },
        });
    }

    watch(name, debounce(async () => {
        if (name.value.trim().length !== 0) {
            await navigateTo({ 
                path: "/", 
                query: { name: name.value },
            });
        } else {
            await navigateTo({ path: "/" });
        }
    }, 500));

    function timerFn() {
        votesCountRequest.execute();
    }
    
    onNuxtReady(() => {
        timer.value = setInterval(timerFn, TIMER_INTERVAL);
    });

    onUnmounted(() => {
        if (timer.value !== null) {
            clearInterval(timer.value);
        }
    });
</script>