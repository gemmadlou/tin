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
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { Schema, UploadLink } from "../../../src/models"
let links = ref<UploadLink[]>([]);
let link = ref<UploadLink>({});
let schema = ref<Schema>({});
const route = useRoute();

const getLinks = async (schemaId: number) => {
    links.value = (await useFetch(`/api/schemas/${schemaId}/upload-links`)).data.value
}

const viewLink = async (link: UploadLink) => {
    link = (await useFetch(`/api/upload-links/${link.id}`)).data.value
}

getLinks(route.params.id)

schema.value = (await useFetch(`/api/schemas/${route.params.id}`)).data.value
</script>