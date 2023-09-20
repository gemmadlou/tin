<template>
  <form class="p-10" @submit.prevent="createSchema">
    <input type="hidden" v-model="schema.form.id" />
    <div class="form-control mb-5">
      <label class="label-text">Schema name</label>
      <input v-model="schema.form.name" type="text" placeholder="Type here"
        class="input input-bordered w-full max-w-xs" />
    </div>

    <div class="form-control mb-5">

      <label class="label">
        <span class="label-text">Create schema</span>
        <a href="https://codebeautify.org/json-to-json-schema-generator" target="_blank">
          <span class="label-text-alt">JSON Schema</span>
        </a>
      </label>
      <textarea v-model="schema.form.json" class="textarea textarea-bordered h-80 font-mono text-xs"
        placeholder="JSON Schema"></textarea>
    </div>
    <div class="text-right">
      <button class="btn">Create Schema</button>
      <button class="btn ml-2">Clear</button>
    </div>

    <div class=""></div>
  </form>

  <div class="p-10">
    <h2>Schemas list</h2>

    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <tbody>
          <tr v-for="schema in schemas">
            <th>{{ schema.id }}</th>
            <td>{{ schema.name }}</td>
            <td><button @click="editSchema(schema)" class="btn btn-outline btn-xs">Edit</button></td>
            <td><button class="btn btn-outline btn-xs btn-disabled">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'

let schema = ref({
  form: {
    id: false,
    name: '',
    json: ''
  },
  success: '',
  error: ''
})

const createSchema = async (event: any) => {
  let data = schema.value.form
  console.log({ data, schema, event })
  data.json = JSON.stringify(JSON.parse(data.json))

  let response = await axios('/api/schema', {
    method: data.id ? 'PUT' : 'POST',
    data
  })

  if (response.error) {
    schema.error = response.error
  }
}

const editSchema = async (schemaData: any) => {
  console.log({schemaData})
  schema.value = {...schema, form: schemaData}
  console.log({ schema })
}

const getSchemas = async () => {
  return await useFetch('/api/schema')
}

let schemas = (await getSchemas()).data.value
console.log({ schemas })
</script>