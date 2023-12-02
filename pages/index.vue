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
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="schema in schemas">
                            <th>{{ schema.id }}</th>
                            <td>{{ schema.name }}</td>
                            <td><button @click="viewSchema(schema)" class="btn btn-outline btn-xs">View</button></td>
                            <td><button class="btn btn-outline btn-xs btn-disabled">Delete</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-span-2">
                <button v-on:click="createSchema" class="btn btn-primary">Create new schema</button>
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
    alert('View schema')
}

let createSchema = () => {
    alert('Create schema')
}
</script>