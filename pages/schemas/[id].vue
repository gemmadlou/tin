<template>
    <div class="opacity-65 mb-5">Schemas > {{ schema.name }}</div>

    <h1 class="text-4xl font-semibold leading-relaxed">Schema Configuration</h1>
    <p class="text-lg text-slate-500 max-w-lg">
        View schema configuration object.
    </p>

    <div class="h-5"></div>

    <div class="text-slate-600 rounded-sm overflow-hidden p-8 shadow-md shadow-purple-100 bg-purple-50">
        <section class="mb-5 max-w-96">
            <label class="block font-bold">ID:</label>

            <div class="inline-grid">
                {{ schema.id }}
            </div>
        </section>
        
        <section class="mb-5 max-w-96">
            <label class="block font-bold">Name:</label>

            <div class="inline-grid">
                {{ schema.name }}
            </div>
        </section>

        <section class="mb-5 max-w-96">
            <label class="block font-bold">Description:</label>

            <div class="inline-grid">
                {{ schema.description }}
            </div>
        </section>
        
        <section>
            <label class="block font-bold mb-2">Schema configuration:</label>

            <div class="inline-grid grid-cols-2 space-x-4">
                <textarea v-model="schema.json" rows="10" placeholder="{}"
                    class="w-96 bg-slate-50 border border-purple-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                    readonly />
            </div>
        </section>
        <div class="h-5"></div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const schemaId = route.params.id;

const schema = ref({
    id: '',
    json: '',
    name: '',
    description: ''
})

let data = await $fetch(`/api/schemas/${schemaId}`)

if (data) {
    schema.value = data
    schema.value.json = JSON.stringify(data.json, null, 4)
}
</script>