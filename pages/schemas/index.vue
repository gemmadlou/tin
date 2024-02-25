<template>
    <div class="opacity-65 mb-5">
        Schemas > Overview
    </div>

    <h1 class="text-4xl font-semibold leading-relaxed">Schemas</h1>
    <p class="text-lg text-slate-500 max-w-lg">
        Create new schemas that define the structure and rules of your data imports.
        We use JSON Schema to achieve a standardised portable format
        that can be used for validation.
    </p>

    <div class="h-10"></div>

    <div class="text-right">
        <NuxtLink to="/schemas/create">
            <FormButton
                class="shadow-lg shadow-purple-100 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white p-8 pt-3 pb-3 rounded font-bold">
                Add new schema
            </FormButton>
        </NuxtLink>
    </div>
    <div class="h-10"></div>

    <div class="rounded-sm overflow-hidden p-8 shadow-md shadow-purple-100 bg-purple-50">
        <table class=" text-slate-500 rounded-lg overflow-hidden text-left min-w-full divide-y divide-gray-200">
            <thead class="text-purple-500 uppercase font-bold tracking-wider opacity-70 text-sm">
                <tr>
                    <th class="px-4 py-2 align-bottom">Schema name</th>
                    <th class="px-4 py-2 align-bottom">Description</th>
                    <th class="px-4 py-2 align-bottom">Created</th>
                    <th class="px-4 py-2"></th>
                    <th class="px-4 py-2"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="schema in schemas" :key="schema.id">
                    <td class="px-4 py-2">{{ schema?.name }}</td>
                    <td class="px-4 py-2">{{ schema.description }}</td>
                    <td class="px-4 py-2">{{ schema.created_at }}</td>
                    <td class="text-purple-500 px-4 py-2 flex items-center space-x-4 justify-end">
                        <NuxtLink :to="`/schemas/${schema.id}`">
                            <button class="hover:text-blue-700">
                                <span class="material-icons">
                                    visibility
                                </span>
                            </button>
                        </NuxtLink>
                    </td>
                    <td class="text-right">
                        <button
                            class="text-sm items-center flex space-x-4 ml-auto border-solid border-2 border-purple-500 hover:bg-purple-500 hover:text-white text-purple-500 p-6 pt-2 pb-2 rounded font-bold">
                            <span class="material-icons">
                                add
                            </span>
                            Import new file
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
const { data: schemas } = await useFetch('/api/schemas')
</script>