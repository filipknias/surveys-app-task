<template>
    <div>
        <div v-if="error" class="bg-red-200 rounded-lg px-8 py-4 mb-8">
            <h1 class="text-red-500 text-xl">
                {{ error.statusMessage }} ({{ error.statusCode }}). Please try again
            </h1>
        </div>
        <div v-if="data.surveys && data.pagination">
            <div class="flex flex-wrap -m-4 mb-12">
                <div class="w-full lg:w-1/3 px-6 py-12" v-for="survey in data.surveys" :key="survey.id">
                    <NuxtLink :to="`/surveys/${survey._id}`">
                        <div class="border border-gray-200 rounded-lg p-4 group">
                            <h2 class="text-2xl mb-4 font-semibold group-hover:underline">{{ survey.name }}</h2>
                            <p class="font-medium text-lg">0 Votes</p>
                        </div>
                    </NuxtLink>
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
    import type { SurveysGetRequest } from "~/types/api";

    const route = useRoute()
    const router = useRouter()
    const PER_PAGE = 1;
    const query = computed(() => ({ page: route.query.page, per_page: PER_PAGE }));

    const { data, status, error, execute } = await useFetch<SurveysGetRequest>('/api/surveys', { query });
    
    async function handlePageChange(page: number) {
        router.push({
            query: { page },
        });
    }
</script>