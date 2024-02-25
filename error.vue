<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: Object as () => NuxtError
})
</script>

<template>
    <NuxtLayout>
        <h1 class="text-4xl font-semibold leading-relaxed">Error {{ error.statusCode }}</h1>
        <div class="h-5"></div>
        <NuxtLink to="/">
            <FormButton>Go home</FormButton>
        </NuxtLink>
    </NuxtLayout>
</template>