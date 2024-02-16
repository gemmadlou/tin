<template>
    <Header />

    <div class="container mx-auto p-5">
        <h1 class="text-xl">{{ schema.name }} schema [{{ schema.id }}] links</h1>

        <div class="h-10"></div>

        <div class="grid grid-cols-4 gap-10">
            <div class="col-span-2">
                <table class="table table-zebra">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Name</td>
                            <td>UUID</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="link in links">
                            <th>{{ link.id }}</th>
                            <td>{{ link.name }}</td>
                            <td>{{ link.uuid }}</td>
                            <td><button @click="viewLink(link)" class="btn btn-outline btn-xs">View</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-span-2 bg-slate-50 p-10">
                <button v-if="!canViewForm" v-on:click="openForm" class="btn btn-neutral">Create upload link</button>
                <div v-else class="text-right">
                    <button v-on:click="closeForm" class="btn btn-xs btn-error text-white">Close</button>
                </div>

                <div v-if="canViewForm">
                    <input v-if="form.id" type="hidden" v-model="form.id" />
                    <input type="hidden" v-model="schema.id" />

                    <div class="form-control mb-5">
                        <label class="label-text">Upload link name</label>
                        <input v-model="form.name" type="text" placeholder="Type here"
                            class="input input-bordered w-full max-w-xs" />
                    </div>

                    <div v-if="form.id" class="form-control mb-5">
                        <label class="label-text">
                            Upload uuid 
                            <span v-if="copied" class="text-xs text-green-600">copied</span>
                        </label>
                        <div class="flex items-center relative w-full max-w-xs">
                            <input v-model="form.url" type="text" placeholder="Type here"
                                class="input input-bordered w-full max-w-xs bg-slate-200 pr-14" readonly />
                            <span v-on:click="copyInput" class="cursor-pointer absolute right-3 text-4xl">📋</span>
                            <nuxt-link class="absolute -right-14 text-4xl hover:bg-gray-200 bg-gray-300 w-10 flex items-center justify-center rounded-md" :to="form.url">
                                <span>↗️</span>
                            </nuxt-link>
                        </div>
                    </div>

                    <div class="text-right">
                        <button v-if="form.id" v-on:click="deleteLink(form.id)" class="btn btn-error mr-5">Delete Upload
                            Link</button>
                        <button v-if="!form.id" v-on:click="save" class="btn btn-neutral">Generate Upload Link</button>
                        <button v-else v-on:click="save" class="btn btn-neutral">Update Upload Link</button>
                    </div>

                    <div class="h-5"></div>

                    <div v-if="error.length" role="alert" class="alert alert-error">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as models from "../../../src/models"
import axios from 'axios';

let links = ref<models.UploadLink[]>([]);
let schema = ref<models.Schema>({});
let error = ref('')
let copied = ref(false)
let form = ref({
    schema_id: undefined,
    id: undefined,
    name: undefined,
    url: ''
})
let canViewForm = ref<boolean>(false);

const route = useRoute();

const getLinks = async (schemaId: number) => {
    links.value = (await useFetch(`/api/schemas/${schemaId}/schema-uploads`)).data.value
}

const viewLink = async (link: models.UploadLink) => {
    let data = (await useFetch(`/api/schema-uploads/${link.id}`)).data.value
    form.value.id = data.id
    form.value.name = data.name
    form.value.schema_id = data.schema_id
    form.value.url = `${window.location.origin}/uploads/${data.uuid}`
    canViewForm.value = true
}

const openForm = () => {
    canViewForm.value = true
}

const closeForm = () => {
    canViewForm.value = false
    form.value.id = undefined
    form.value.name = undefined
    form.value.schema_id = undefined
    form.value.url = ''
}

const save = async () => {
    let data = { ...form.value }

    if (data.id) {
        await axios.put(`/api/schema-uploads/${data.id}`, data)
    } else {
        await axios.post(`/api/schemas/${schema.value.id}/schema-uploads`, data)
    }

    await getLinks(route.params.id)
}

const deleteLink = async (linkId: number) => {
    await axios.delete(`/api/schema-uploads/${linkId}`)

    closeForm()

    await getLinks(route.params.id)
}

const copyInput = async () => {
    try {
        await navigator.clipboard.writeText(form.value.url || '')
        copied.value = true
        setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch (e) {
        alert('Cannot copy')
    }
}

getLinks(route.params.id)

schema.value = (await useFetch(`/api/schemas/${route.params.id}`)).data.value
</script>