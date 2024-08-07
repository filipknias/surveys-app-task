<template>
  <nav class="bg-gray-800 py-6 px-2">
    <div class="container mx-auto">
        <div class="flex items-center flex-wrap">
            <h1 class="text-white text-2xl mr-12">Surveys</h1>
            <ul class="flex items-center gap-6 flex-wrap">
                <NuxtLink to="/" class="text-white hover:underline">Home</NuxtLink>
                <NuxtLink to="/surveys/new" class="text-white hover:underline">Create survey</NuxtLink>
            </ul>
        </div>
    </div>
  </nav>
</template>