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
                <button v-if="!canViewForm" v-on:click="openSchemaForm" class="btn btn-primary">Create new schema</button>
                <div v-else class="text-right">
                    <button v-on:click="closeSchemaForm" class="btn btn-xs btn-error text-white">Close</button>
                </div>

                <div v-if="canViewForm">
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
                        <button v-if="form.id" v-on:click="deleteSchema" class="btn btn-error mr-5">Delete Schema</button>
                        <button v-if="!form.id" v-on:click="saveSchema" class="btn btn-primary">Create Schema</button>
                        <button v-else v-on:click="saveSchema" class="btn btn-primary">Update Schema</button>
                    </div>

                    <div v-if="error" role="alert" class="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{{ error }}</span>
                    </div>

                </div>
            </div>
        </div>
    </div>

    View prototype <nuxt-link to="/prototype">here</nuxt-link>.
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as model from "../src/models";
import axios from 'axios';

let schemas = ref<model.Schema[]>([]);

let getSchemas = async () => {
    schemas.value = (await useFetch('/api/schemas')).data.value
}

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

let error = ref('');

let saveSchema = async (event: any) => {
    let data = { ...form.value }
    data.json = JSON.stringify(JSON.parse(data.json || '{}'))

    let response = await axios('/api/schemas', {
        method: data.id ? 'PUT' : 'POST',
        data
    })

    if (response.error) {
        error = response.error
        return
    }

    closeSchemaForm()

    await getSchemas()
}

let openSchemaForm = () => {
    canViewForm.value = true
}

let closeSchemaForm = () => {
    canViewForm.value = false
    form.value.id = undefined
    form.value.name = undefined
    form.value.json = undefined
}

let deleteSchema = async () => {
    let response = await axios.delete(`/api/schemas/${form.value.id}`)

    if (response.error) {
        error = response.error
        return
    }

    await closeSchemaForm()

    await getSchemas()
}

await getSchemas()
</script>