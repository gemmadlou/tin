<template>
    <Header />

    <div class="container mx-auto p-5">
        <h1 class="text-xl">Import your data file
            <span class="uppercase text-sm font-bold block">
                Schema {{ schema.id }} - {{ schema.name }}
            </span>
        </h1>

        <div class="h-10"></div>

        <div class="max-w-4xl grid grid-cols-4 gap-10">
            <div class="col-span-1 flex items-center justify-center bg-gray-100 rounded-lg">
                <div class="flex items-center">
                    <div class="mr-3 uppercase font-bold">Step</div>
                    <div class="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center">
                        1
                    </div>
                </div>
            </div>
            <div class="col-span-3">

                <form v-if="upload.form.id" class="mt-10 mb-10" @submit.prevent="removeFile">
                    <div class="overflow-x-auto">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th>{{ link.id }}</th>
                                    <td>{{ upload.form.filename }}</td>
                                    <td>
                                        <button class="btn">
                                            ❌
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

        <div>
            Step 2 - Map file
        </div>

        <div class="h-10"></div>

        <div>
            Step 3 - Import file
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
        id: false,
        filename: undefined
    },
    success: '',
    error: '',
})

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
    return (await useFetch(`/api/upload-links/${paramId}`)).data.value
}

const getSchema = async (paramId: string | number) => {
    return (await useFetch(`/api/schemas/${paramId}`)).data.value
}

const getUploadFile = async (uploadId: string | number) => {
    return (await useFetch(`/api/uploads/${uploadId}`)).data.value
}

const removeFile = async () => {
    
}

const setSchemaInfo = async () => {
    let uploadLink: models.UploadLink = await getUploadLink(route.params.id)
    link.value = uploadLink
    schema.value = await getSchema(uploadLink.schema_id)
    if (uploadLink.upload_id) {
        upload.value.form = await getUploadFile(uploadLink.upload_id)
    }

}

setSchemaInfo()
</script>