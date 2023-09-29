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

  <div class="p-10">
    <h2>Uploads</h2>
    <form @submit.prevent="uploadFile">
      <div class="form-control w-full max-w-xs mb-2">
        <label class="label">
          <span class="label-text">Pick a data file eg. csv</span>
        </label>
        <input type="file" v-on:change="onFileChange" class="file-input file-input-bordered w-full max-w-xs" />
      </div>
      <div>
        <button type="submit" class="btn">Upload</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { VueElement } from 'nuxt/dist/app/compat/capi';

let schema = ref({
  form: {
    id: false,
    name: '',
    json: ''
  },
  success: '',
  error: ''
})

let upload = ref({
  form: {
    id: false,
    file: null
  },
  success: '',
  error: ''
})

const createSchema = async (event: any) => {
  let data = schema.value.form
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
  schema.value = {...schema, form: schemaData}
  console.log({ schema })
}

let schemas = (await useFetch('/api/schema')).data.value

interface InputFileEvent extends Event {
    target: HTMLInputElement;
}

const onFileChange = (e : InputFileEvent) => {
  upload.value.form.file = e.target.files || null;
}

const uploadFile = async () => {

  let data = upload.value.form
  console.log({ data: data.file })

  let response = await axios.postForm('/api/uploads', {
    files:  data.file
  });

}

</script>