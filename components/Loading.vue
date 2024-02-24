<template>
    <div :style="loadingStyle"
        class="fixed top-0 left-0 z-10 flex justify-center items-center h-full w-full opacity-0 transition-opacity duration-300">
        <div class="absolute top-0 left-0 w-full h-full bg-slate-950 opacity-30"></div>
        <div class="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-purple-200"></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    loading: Boolean
});

const loadingStyle = computed(() => props.loading ? "opacity: 1; z-index: 10;" : "opacity: 0; z-index: -1")
</script>