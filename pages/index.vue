<template>
    <div>
        <div v-if="error" class="bg-red-200 rounded-lg px-8 py-4 mb-8">
            <h1 class="text-red-500 text-xl">
                {{ error.statusMessage }} ({{ error.statusCode }}). Please try again
            </h1>
        </div>
        <div class="mb-8">
            <label for="name" class="mb-2 block font-semibold text-lg">Find by name</label>
            <input type="text" id="name" v-model="name" class="border rounded-lg px-4 py-2 w-full" placeholder="Name..." />
        </div>
        <div v-if="data.surveys.length === 0" class="bg-blue-200 rounded-lg px-8 py-4 mb-8">
            <h1 class="text-blue-500 text-xl">No surveys found</h1>
        </div>
        <div class="flex flex-wrap -m-4 mb-12">
            <div class="w-full lg:w-1/3 p-4" v-for="survey in data.surveys" :key="survey.id">
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
</template>

<script lang="ts" setup>
    import type { SurveysGetRequest } from "~/types/api";
    import { debounce } from 'lodash';

    const route = useRoute()
    const router = useRouter()
    const PER_PAGE = 3;
    const name = ref("");
    const query = computed(() => ({ page: route.query.page, per_page: PER_PAGE, name: route.query.name }));

    const { data, error } = await useFetch<SurveysGetRequest>('/api/surveys', { query });
    
    async function handlePageChange(page: number) {
        navigateTo({ 
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
</script>