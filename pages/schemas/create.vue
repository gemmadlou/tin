<template>
    <h1 class="text-4xl font-semibold leading-relaxed">Add new schema</h1>
    <p class="text-lg text-slate-500 max-w-lg">
        Define, import or upload your schema configuration.
        Schema configurations define the structure of data and
        helps us map future uploads to conform to the configuration.
    </p>

    <div class="h-10"></div>

    <div class="text-slate-600 rounded-sm overflow-hidden p-8 shadow-md shadow-purple-100 bg-purple-50">
        <label class="font-bold">
            Create schema by:
        </label>
        <div class="grid grid-cols-3 gap-4 max-w-3xl">
            <div class="flex items-center space-x-3 p-4 pl-0">
                <input type="radio" name="options" class="h-4 w-4" checked />
                <label class="block">
                    JSON schema input
                </label>
            </div>

            <div class="hidden items-center space-x-3 p-4 pl-0">
                <input type="radio" name="options" class="h-4 w-4" />
                <label class="block">
                    Upload file
                </label>
            </div>

            <div class="hidden items-center space-x-3 p-4 pl-0">
                <input type="radio" name="options" class="h-4 w-4" />
                <label class="block">
                    Connect to URL
                </label>
            </div>
        </div>
    </div>

    <div class="h-5"></div>

    <div class="text-slate-600 rounded-sm overflow-hidden p-8 shadow-md shadow-purple-100 bg-purple-50">
        <label class="block font-bold mb-5">
            Schema configuration
        </label>

        <div class="inline-grid grid-cols-2 space-x-4">
            <div>
                <textarea v-model="formData.json" rows="10" placeholder="{}"
                    class="w-96 border border-purple-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500" />
            </div>
            <div class="max-w-64 italic text-slate-400">
                Add JSON Schema in correct JSON format.
                View the documentations at
                <a class="text-slate-500 hover:text-purple-500" href="https://json-schema.org/"
                    target="_blank">json-schema.org</a>.
            </div>
        </div>

        <div class="h-5"></div>

        <div v-if="hasError">
            <label class="block font-bold mb-5">
                Errors
            </label>
            <div class="bg-red-200 p-6 pt-4 pb-4 rounded-lg">
                <span class="block" v-for="i in error.map((i: any) => `${i.path.replace('$.json', '$')} ${i.error}`)">{{
                    i }}</span>
            </div>
        </div>
    </div>

    <div class="h-10"></div>

    <div class="text-right">
        <FormButton @click="submitForm">
            Save
        </FormButton>
    </div>

    <Loading :loading="isLoading" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { schema } from "../../server/api/schemas/index.post"
import { safeParse } from 'valibot';

const formData = ref({ json: '' });
const isLoading = ref(false);
const error = ref<Record<string, any>[]>([]);
const failure = ref('')

const hasError = computed(() => error.value.length > 0 || false)

const submitForm = async () => {
    
    try {
        if (isLoading.value) {
            console.warn('Form is already submitting. Please wait.');
            return;
        }

        isLoading.value = true;

        const body = { json: JSON.parse(formData.value.json || '{}') }
        const validated = safeParse(schema, body)

        if (!validated.success) {
            error.value = flatten(validated);
            return;
        }

        const response = await fetch('/api/schemas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            let responseData = await response.json()
            formData.value = { json: '' };
            const redirectUrl = `/schemas/${responseData.id}`;
            window.location.href = redirectUrl;
        } else {
            console.error('Failed to submit form data:', response.statusText);
        }
    } catch (error) {
        console.error(error instanceof Error ? error.stack : 'An unknown error occurred:', error);
        failure.value = "An unknown error has occurred. See logs."
    } finally {
        isLoading.value = false
    }
};
</script>