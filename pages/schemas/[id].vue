<template>
    <div class="opacity-65 mb-5">Schemas > {{ name }}</div>

    <h1 class="text-4xl font-semibold leading-relaxed">Schema Configuration</h1>
    <p class="text-lg text-slate-500 max-w-lg">
        View schema configuration object.
    </p>
    
    <div class="h-5"></div>

    <div class="text-slate-600 rounded-sm overflow-hidden p-8 shadow-md shadow-purple-100 bg-purple-50">
        <label class="block font-bold mb-5">Schema configuration</label>

        <div class="inline-grid grid-cols-2 space-x-4">
            <div>
                <textarea v-model="formData.json" rows="10" placeholder="{}"
                    class="w-96 border border-purple-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500" 
                    readonly />
            </div>
        </div>

        <div class="h-5"></div>

        <div v-if="hasError">
            <label class="block font-bold mb-5">Errors</label>
            <div class="bg-red-200 p-6 pt-4 pb-4 rounded-lg">
                <span class="block" v-for="i in error.map((i: any) => `${i.path.replace('$.json', '$')} ${i.error}`)">{{
                    i }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const formData = ref({ json: '' })
</script>