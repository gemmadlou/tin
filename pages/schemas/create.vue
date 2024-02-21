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

        <div>
            <label class="block font-bold">
                Schema configuration
            </label>
            <div class="inline-grid grid-cols-2 space-x-4">
                <div>
                    <textarea v-model="formData.json" rows="10" placeholder="{}"
                        class="w-96 border border-purple-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500">
                    </textarea>
                </div>
                <div class="max-w-64 italic text-slate-400">
                    Add JSON Schema in correct JSON format.
                    View the documentations at
                    <a href="https://json-schema.org/" target="_blank">json-schema.org</a>.
                </div>
            </div>
        </div>
    </div>

    <div class="h-10"></div>

    <div class="text-right">
        <button @click="submitForm"
            class="shadow-lg shadow-purple-100 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white p-8 pt-3 pb-3 rounded font-bold">
            Save
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formData = ref({
    json: ''
});

const isLoading = ref(false);

const error = ref({})

const submitForm = async () => {
    try {

        // Check if the form is already loading
        if (isLoading.value) {
            console.warn('Form is already submitting. Please wait.');
            return;
        }

        // Start loading
        isLoading.value = true;

        // Send a POST request with the JSON data
        const response = await fetch('/api/schemas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ json: JSON.parse(formData.value.json) }) // Send formData.value as JSON
        });

        if (response.ok) {
            let responseData = await response.json()

            // Clear form
            formData.value = { json: '' };

            const redirectUrl = `/schemas/${responseData.id}`;
            window.location.href = redirectUrl;
        } else {
            console.error('Failed to submit form data:', response.statusText);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error submitting form data:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    } finally {
        isLoading.value = false
    }
};
</script>