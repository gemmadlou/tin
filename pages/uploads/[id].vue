<template>
    <Header />

    <div class="container mx-auto p-5">
        <h1 class="text-xl">Import your data file / <strong>{{ link.name }}</strong>
            <span class="uppercase text-sm font-bold block">
                Schema {{ schema.id }} - {{ schema.name }}
            </span>
        </h1>

        <div class="h-10"></div>

        <div class="grid grid-cols-5 gap-10">
            <div class="col-span-3">
                <div class="max-w-4xl grid grid-cols-5 gap-5 bg-gray-50 p-5">
                    <div class="h-36 col-span-1 flex items-center justify-center bg-gray-200 rounded-lg">
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
                                            <td class="text-right">
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
                    <div class="h-36 col-span-1 flex items-center justify-center bg-gray-200 rounded-lg">
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
                                <Mapper 
                                    v-if="schema.json && extractedFileData.length" 
                                    :linkId="route.params.id"
                                    :extractedFileData="extractedFileData"
                                    :schema="schema" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-10"></div>

                <div class="max-w-4xl grid grid-cols-5 gap-5 bg-gray-50 p-5">
                    <div class="h-36 col-span-1 flex items-center justify-center bg-gray-200 rounded-lg">
                        <div class="flex items-center m-3">
                            <div class="mr-3 uppercase font-bold">Step</div>
                            <div class="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center">
                                3
                            </div>
                        </div>
                    </div>
                    <div class="col-span-3 flex justify-between items-start">
                        <h2 class="font-bold uppercase">
                            View mapped data
                        </h2>
                        <div class="text-right self-end">
                            <button class="btn btn-neutral" v-on:click="mapData">Map Data</button>
                        </div>
                    </div>
                </div>

                <div class="h-10"></div>

                <div class="max-w-4xl grid grid-cols-5 gap-5 bg-gray-50 p-5">
                    <div class="h-36 col-span-1 flex items-center justify-center bg-gray-200 rounded-lg">
                        <div class="flex items-center m-3">
                            <div class="mr-3 uppercase font-bold">Step</div>
                            <div class="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center">
                                4
                            </div>
                        </div>
                    </div>
                    <div class="col-span-3">
                        <h2 class="font-bold uppercase mb-5">
                            Complete
                        </h2>
                        <p class="mb-5">Mark as ready for integration means we can import it for you.</p>
                        <div class="text-right self-end">
                            <button class="btn btn-neutral" v-on:click="markAsReadyForImport">Finish</button>
                        </div>
                    </div>
                </div>


            </div>
            <div class="col-span-2">
                <div>
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

                <div class="h-10"></div>

                <div>

                    <h2 class="font-bold uppercase mb-5">
                        Mapped file data
                    </h2>

                    <div v-if="mappedData.length" class="overflow-x-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Row</th>
                                    <th v-for="(field, heading) in mappedData[0].json">{{ heading }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- row 1 -->
                                <tr v-for="data in mappedData">
                                    <th>{{ data.row_id }}</th>
                                    <td v-for="field in data.json">{{ field.join(' ') }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from "axios";
import * as models from "../../src/models"
import { ref } from "vue"
import type { DataHeading, Mapped } from "../../modules/transformations/Transformer";
import Sdk from "../../modules/uploads/Sdk";

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
    mapper_id: undefined,
    uuid: undefined,
    status: undefined,
    created_at: undefined,
    deleted_at: undefined
})

const upload = ref({
    form: {
        id: undefined,
        filename: undefined
    },
    success: '',
    error: '',
})

let mappedData = ref([]);

const extractedFileData = ref<Record<string, any>[]>([])

const uploadFile = async () => {
    let data = upload.value.form

    try {

        let response = await axios.postForm('/api/uploads', {
            files: data.filename
        });

        await axios.put(`/api/schema-uploads/${link.value.id}`, {
            ...link.value,
            upload_id: response.data.id
        })

        upload.value.success = "File uploaded"

        if (link.value.id)
            link.value = await Sdk.schemaUploads.get(link.value.id)
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
    let uploadLink: models.UploadLink = await Sdk.schemaUploads.get(route.params.id)
    link.value = uploadLink
    schema.value = await getSchema(uploadLink.schema_id)
    if (uploadLink.upload_id) {
        upload.value.form = await getUploadFile(uploadLink.upload_id)
        extractedFileData.value = await getExtractedFileData(uploadLink.upload_id)
    }
}

const mapData = async () => {
    try {
        let response = (await axios.put(`/api/schema-uploads/${link.value.id}/map`))
        alert('Successfully mapped')
    } catch (e) {
        alert('Error')
    }
}

const markAsReadyForImport = async () => {
    await axios.put(`/api/schema-uploads/${link.value.id}`, {
        ...link.value,
        // @todo put into Enum
        status: "ready_for_import"
    })
}

onMounted(async () => {
    await setSchemaInfo()

    mappedData.value = (await useFetch(`/api/schema-uploads/${route.params.id}/map`)).data.value
})

</script>