<template>
    <div class="container mx-auto p-5">
        <h1 class="text-xl">Schemas</h1>

        <div class="h-10"></div>

        <div class="grid grid-cols-4 gap-10">
            <div class="col-span-2">
                <table class="table table-zebra">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Name</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="schema in schemas">
                            <th>{{ schema.id }}</th>
                            <td>{{ schema.name }}</td>
                            <td><button @click="viewSchema(schema)" class="btn btn-outline btn-xs">View</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-span-2 bg-slate-50 p-10">
                <button v-if="!canViewForm" v-on:click="createSchema" class="btn btn-primary">Create new schema</button>
                <div v-else class="text-right">
                    <button v-on:click="closeSchemaForm" class="btn btn-error text-white">Close</button>
                </div>

                <form v-if="canViewForm" @submit.prevent="createSchema">
                    <input v-if="form.id" type="hidden" v-model="form.id" />

                    <div class="form-control mb-5">
                        <label class="label-text">Schema name</label>
                        <input v-model="form.name" type="text" placeholder="Type here"
                            class="input input-bordered w-full max-w-xs" />
                    </div>

                    <div class="form-control mb-5">
                        <label class="label">
                            <span class="label-text">Create schema</span>
                            <a href="https://codebeautify.org/json-to-json-schema-generator" target="_blank">
                                <span class="label-text-alt">JSON Schema</span>
                            </a>
                        </label>
                        <textarea v-model="form.json" class="textarea textarea-bordered h-80 font-mono text-xs"
                            placeholder="JSON Schema"></textarea>
                    </div>
                    <div class="text-right">
                        <button v-if="!form.id" class="btn btn-primary">Create Schema</button>
                        <button v-else class="btn btn-primary">Edit Schema</button>
                    </div>

                </form>
            </div>
        </div>
    </div>

    View prototype <nuxt-link to="/prototype">here</nuxt-link>.
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as model from "../src/models";

let schemas = ref<model.Schema[]>([]);
schemas = (await useFetch('/api/schema')).data.value

let viewSchema = (schema: model.Schema) => {
    canViewForm.value = true
    form.value.id = schema.id
    form.value.name = schema.name
    form.value.json = schema.json
}

let canViewForm = ref(false);

type SchemaForm = {
    id: number | undefined,
    name: string | undefined,
    json: string | undefined
}

let form = ref<SchemaForm>({
    id: undefined,
    name: undefined,
    json: undefined
})

let createSchema = () => {
    alert('Create schema')
}

let closeSchemaForm = () => {
    canViewForm.value = false
    form.value.id = undefined
    form.value.name = undefined
    form.value.json = undefined
}
</script>