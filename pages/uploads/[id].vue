<template>
    <Header />

    <div class="container mx-auto p-5">
        <h1 class="text-xl">Import your data file
            <span class="uppercase text-sm font-bold block">
                Schema {{ schema.id }} - {{ schema.name }}
            </span>
        </h1>

        <div class="h-10"></div>

        <div class="grid grid-cols-5 gap-10">
            <div class="col-span-3">
                <div class="max-w-4xl grid grid-cols-5 gap-5 bg-gray-50 p-5">
                    <div class="col-span-2 flex items-center justify-center bg-gray-200 rounded-lg">
                        <div class="flex items-center m-3">
                            <div class="mr-3 uppercase font-bold">Step</div>
                            <div class="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center">
                                1
                            </div>
                        </div>
                    </div>
                    <div class="col-span-3">
                        <h2 class="font-bold uppercase mb-5">
                            Upload File
                        </h2>
                        <form v-if="upload.form.id" class="" @submit.prevent="removeFile">
                            <div class="overflow-x-auto">
                                <table class="table">
                                    <tbody>
                                        <tr>
                                            <th>{{ link.id }}</th>
                                            <td>{{ upload.form.filename }}</td>
                                            <td>
                                                <button v-on:click="extractUpload(upload.form.id)" class="btn btn-neutral">
                                                    Extract
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </form>
                        <form v-else class="flex" @submit.prevent="uploadFile">
                            <div class="mr-3 form-control w-full max-w-xs">
                                <label class="label">
                                    <span class="label-text">Pick a data file eg. csv</span>
                                </label>
                                <input type="file" v-on:change="onFileChange"
                                    class="file-input file-input-bordered w-full max-w-xs" />
                            </div>
                            <div class="self-end">
                                <button type="submit" class="btn">Upload</button>
                            </div>
                        </form>
                        <div v-if="upload.error" class="text-red-500">{{ upload.error }}</div>
                        <div v-if="upload.success" class="text-green-500">{{ upload.success }}</div>
                    </div>
                </div>

                <div class="h-10"></div>

                <div class="max-w-4xl grid grid-cols-5 gap-5 bg-gray-50 p-5">
                    <div class="col-span-2 flex items-center justify-center bg-gray-200 rounded-lg">
                        <div class="flex items-center m-3">
                            <div class="mr-3 uppercase font-bold">Step</div>
                            <div class="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center">
                                2
                            </div>
                        </div>
                    </div>
                    <div class="col-span-3">
                        <h2 class="font-bold uppercase mb-5">
                            Map file
                        </h2>
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
                                            <div v-for="(mappedField, mappedIndex) in mappedFields[schema]"
                                                class="flex space-x-8">
                                                <select v-model="mappedFields[schema][mappedIndex]"
                                                    class="select select-bordered w-44">
                                                    <option v-for="(field) in mapper.uploadFields">{{ field }}</option>
                                                </select>
                                                <div class="flex space-x-2">
                                                    <button v-on:click="addNewField(schema)" class="btn">✚</button>
                                                    <button v-if="mappedIndex > 0 || !isRequiredField(schema)"
                                                        v-on:click="removeNewField(schema, mappedIndex)"
                                                        class="btn">-</button>
                                                </div>
                                            </div>
                                            <div v-if="mappedFields[schema].length === 0">
                                                <button v-on:click="addNewField(schema)" class="btn">✚</button>
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <div class="h-5"></div>

                                <div class="text-right">
                                    <button class="btn btn-neutral" v-on:click="saveMapper">Save Mapper</button>
                                </div>
                            </div>
                            <div class="basis-1/2">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-10"></div>

                <div>
                    Step 3 - Import file
                </div>
            </div>
            <div class="col-span-2">

                <h2 class="font-bold uppercase mb-5">
                    Extracted file data
                </h2>

                <table class="table table-zebra">
                    <thead>
                        <tr>
                            <td>Row</td>
                            <td v-if="extractedFileData.length" v-for="(extract, heading) in extractedFileData[0].json">
                                {{ heading }}
                            </td>
                        </tr>
                    </thead>
                    <tr v-for="extract in extractedFileData">
                        <td>{{ extract.row_id }}</td>
                        <td v-for="json in extract.json">{{ json }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from "axios";
import * as models from "../../src/models"
import { ref } from "vue"

const route = useRoute()

const schema = ref<models.UndefinedSchema>({
    id: undefined,
    name: undefined,
    json: undefined
})

const link = ref<models.UndefinedUploadLink>({
    id: undefined,
    name: undefined,
    upload_id: undefined,
    schema_id: undefined,
    uuid: undefined
})

const upload = ref({
    form: {
        id: undefined,
        filename: undefined
    },
    success: '',
    error: '',
})

const extractedFileData = ref<Record<string, any>[]>([])

const uploadFile = async () => {
    let data = upload.value.form

    try {

        let response = await axios.postForm('/api/uploads', {
            files: data.filename
        });

        await axios.put(`/api/upload-links/${link.value.id}`, {
            ...link.value,
            upload_id: response.data.id
        })

        upload.value.success = "File uploaded"

        link.value = await getUploadLink(link.value.id)
        // upload.value.form = (await useFetch(`/api/upload/${response.data.id}`)).data.value
    } catch (responseError: unknown) {
        if (responseError.response) {
            upload.value.error = responseError.response.data.error
        }
    }
}

interface InputFileEvent extends Event {
    target: HTMLInputElement;
}

const onFileChange = async (e: InputFileEvent) => {
    if (!e.target.files) {
        return;
    }
    upload.value.form.filename = e.target.files;
}

const getUploadLink = async (paramId: string | number) => {
    return (await axios.get(`/api/upload-links/${paramId}`)).data
}

const getSchema = async (paramId: string | number) => {
    return (await axios.get(`/api/schemas/${paramId}`)).data
}

const getUploadFile = async (uploadId: string | number) => {
    return (await axios.get(`/api/uploads/${uploadId}`)).data
}

const removeFile = async () => {
    // @todo
}

const extractUpload = async (uploadId: number) => {
    let response = await axios.post('/api/extracts', {
        fileId: uploadId
    })
}

const getExtractedFileData = async (uploadId: string | number) => {
    return (await axios.get(`/api/uploads/${uploadId}/extracts`)).data
}

const setSchemaInfo = async () => {
    let uploadLink: models.UploadLink = await getUploadLink(route.params.id)
    link.value = uploadLink
    schema.value = await getSchema(uploadLink.schema_id)
    if (uploadLink.upload_id) {
        upload.value.form = await getUploadFile(uploadLink.upload_id)
        extractedFileData.value = await getExtractedFileData(uploadLink.upload_id)
    }
}

const isRequiredField = (schema: string) => {
    return false
}

const addNewField = (schema: string) => {
    mappedFields.value[schema].push(mapper.value.uploadFields[0])
}

const removeNewField = async (schema: string | number, index: number) => {
    mappedFields.value[schema].splice(index, 1)
}

const saveMapper = () => {

}

type MappedField = Record<string, string[]>;
let mappedFields = ref(<MappedField>{})

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

const createMapperUi = async () => {
    let schemeFields = Object.keys(schema.value?.json?.properties)

    // let uploadFields = (await useFetch(`/api/uploads/${mapper.value.form.uploadId}/extracts`)).data.value
    let uploadFields = Object.keys(extractedFileData.value[0].json).filter(i => i)

    mappedFields.value = schemeFields.reduce((mapped: MappedField, schemaField: string | number) => {
        mapped[schemaField] = [uploadFields[0]]
        return mapped
    }, {})

    mapper.value.required = schema.value?.json?.required
    mapper.value.schemaFields = schemeFields
    mapper.value.uploadFields = uploadFields
}

onMounted(async () => {
    await setSchemaInfo()
    await createMapperUi()
})

</script>