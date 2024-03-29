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
  
    <div class="p-10">
      <h2>Uploads list</h2>
  
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <tbody>
            <tr v-for="upload in uploads">
              <th>{{ upload.id }}</th>
              <td>{{ upload.filename }}</td>
              <td>{{ upload.filepath }}</td>
              <td><button @click="viewExtract(upload)" class="btn btn-outline btn-xs">View</button></td>
              <td><button @click="extractUpload(upload)" class="btn btn-outline btn-xs">Extract</button></td>
              <td><button class="btn btn-outline btn-xs btn-disabled">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  
    <div v-if="extracts.data.length > 0" class="p-10">
      <h2>Extracted data </h2>
      <table class="table table-zebra">
        <tr v-for="extract in extracts.data">
          <td>{{ extract.upload_id }}</td>
          <td>{{ extract.row_id }}</td>
          <td v-for="json in extract.json">{{ json }}</td>
        </tr>
      </table>
    </div>
  
    <div class="p-10">
      <h2 class="mb-10">Create new data map</h2>
  
      <div class="mb-10 flex space-x-8 items-center ">
        <div class="form-control w-full max-w-fit">
          <label class="label">
            <span class="label-text">Select schema</span>
          </label>
          <input v-model="mapper.form.schemaId" type="number" class="input input-bordered w-full max-w-xs" />
        </div>
  
        <div class="form-control w-full max-w-fit">
          <label class="label">
            <span class="label-text">Select upload</span>
          </label>
          <input v-model="mapper.form.uploadId" type="number" class="input input-bordered w-full max-w-xs" />
        </div>
  
        <div class="form-control">
          <label class="label opacity-0">
            <span class="label-text">&nbsp;</span>
          </label>
          <button v-on:click="createMapperUi" class="btn">Create map</button>
        </div>
      </div>
  
      <h2 class="mb-10">Mapper UI</h2>
  
      <div class="flex space-x-8 mb-10">
        <div class="basis-1/2">
          <table v-for="schema in mapper.schemaFields" class="table table-zebra w-full max-w-md">
            <tr>
              <td class="w-32 capitalize">
                <div class="w-32">
                  {{ schema }}
                  <span v-if="isRequiredField(schema)">*</span>
                </div>
              </td>
              <td>
                <div v-for="(mappedField, mappedIndex) in mappedFields[schema]" class="flex space-x-8">
                  <select v-model="mappedFields[schema][mappedIndex]" class="select select-bordered w-44">
                    <option v-for="(field) in mapper.uploadFields">{{ field }}</option>
                  </select>
                  <div class="flex space-x-2">
                    <button v-on:click="addNewField(schema)" class="btn">✚</button>
                    <button v-if="mappedIndex > 0 || !isRequiredField(schema)" v-on:click="removeNewField(schema, mappedIndex)" class="btn">-</button>
                  </div>
                </div>
                <div v-if="mappedFields[schema].length === 0">
                  <button v-on:click="addNewField(schema)" class="btn">✚</button>
                </div>
              </td>
            </tr>
          </table>
          <div class="">
            <button class="btn" v-on:click="saveMapper">Save Mapper</button>
          </div>
        </div>
        <div class="basis-1/2">
        </div>
      </div>
  
      <!-- Mappers: view -->
      <div>
        <h2 class="mb-10">Mappers</h2>
        <table class="table table-zebra">
          <thead>
            <tr>
              <td>Mapper Id</td>
              <td>Schema Id</td>
              <td>Upload Id</td>
              <td>Mapper Config</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mapper in mappers">
              <td>{{ mapper.id }}</td>
              <td>{{ mapper.schema_id }}</td>
              <td>{{ mapper.upload_id }}</td>
              <td>{{ mapper.config }}</td>
              <td>
                <button v-on:click="mapData(mapper.id)" class="btn btn-xs">Map data</button>
              </td>
              <td>
                <button v-on:click="viewMappedData(mapper.id)" class="btn btn-xs">View data</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Mapped-data: view -->
  
      <div>
        <h2 class="mb-10">Mapped data</h2>
        {{ mappedData }}
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
  
  let upload = ref({
    form: {
      id: false,
      file: null
    },
    success: '',
    error: '',
  })
  
  const createSchema = async (event: any) => {
    let data = schema.value.form
    data.json = JSON.stringify(JSON.parse(data.json))
  
    let response = await axios('/api/schemas', {
      method: data.id ? 'PUT' : 'POST',
      data
    })
  
    if (response.error) {
      schema.error = response.error
    }
  }
  
  const editSchema = async (schemaData: any) => {
    schema.value = { ...schema, form: schemaData }
  }
  
  let schemas = (await useFetch('/api/schemas')).data.value
  
  interface InputFileEvent extends Event {
    target: HTMLInputElement;
  }
  
  const onFileChange = (e: InputFileEvent) => {
    upload.value.form.file = e.target.files || null;
  }
  
  type Upload = {
    created: String,
    id: Number,
    filename: String,
    filepath: String
  }
  const uploadFile = async () => {
  
    let data = upload.value.form
  
    let response = await axios.postForm('/api/uploads', {
      files: data.file
    });
  
  }
  
  let uploads = (await useFetch('/api/uploads')).data.value
  
  const extractUpload = async (upload: Upload) => {
  
    let response = await axios.post('/api/extracts', {
      fileId: upload.id
    })
  }
  
  type Extract = {
    upload_id: Number,
    row_id: Number,
    json: string
  }
  
  let extracts = reactive({
    data: []
  })
  
  const viewExtract = async (upload: Upload) => {
    extracts.data = (await useFetch(`/api/extracts/${upload.id}`)).data.value
  }
  
  type MappedField = Record<string, string[]>;
  
  type SchemaFieldName = string | number;
  
  type Mapper = {
    form: {
      schemaId: number,
      uploadId: number
    },
    required: string[],
    schemaFields: string[],
    uploadFields: string[]
  }
  
  let mapper = ref<Mapper>({
    form: {
      schemaId: 2,
      uploadId: 1
    },
    required: [],
    schemaFields: [],
    uploadFields: []
  })
  
  let mappedFields = ref(<MappedField>{})
  
  const createMapperUi = async () => {
    let schema = (await useFetch(`/api/schema/${mapper.value.form.schemaId}`)).data.value
    let schemeFields = Object.keys(schema.json.properties)
  
    let uploadFields = (await useFetch(`/api/uploads/${mapper.value.form.uploadId}/extracts`)).data.value
    uploadFields = Object.keys(uploadFields[0].json).filter(i => i)
  
    mappedFields.value = schemeFields.reduce((mapped: MappedField, schemaField: SchemaFieldName) => {
      mapped[schemaField] = [uploadFields[0]]
      return mapped
    }, {})
  
    mapper.value.required = schema.json.required
    mapper.value.schemaFields = schemeFields
    mapper.value.uploadFields = uploadFields
  }
  
  createMapperUi()
  
  const addNewField = async (schema: SchemaFieldName) => {
    mappedFields.value[schema].push(mapper.value.uploadFields[0])
  }
  
  const removeNewField = async (schema: SchemaFieldName, index: number) => {
    mappedFields.value[schema].splice(index, 1)
  }
  
  const saveMapper = async () => {
    let data = {
      upload_id: mapper.value.form.uploadId,
      schema_id: mapper.value.form.schemaId,
      config: mappedFields.value
    }
  
    let response = await axios.post('/api/mappers', data);
  
    createMapperUi()
  }
  
  let mappers = (await useFetch(`/api/mappers`)).data
  
  const mapData = async (mapperId: number) => {
    let response = (await axios.post(`/api/mappers/${mapperId}/map`))
    alert('Data mapped')
  }
  
  let mappedData = ref([])
  const viewMappedData = async (mapperId: number) => {
    mappedData.value = await useFetch(`/api/mappers/${mapperId}/map`)
  }
  
  const isRequiredField = (schema: string) => {
    return mapper.value.required.filter(i => i === schema).length !== 0
  }
  </script>