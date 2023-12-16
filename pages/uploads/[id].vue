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
                <form class="flex" @submit.prevent="uploadFile">
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
import * as models from "../../src/models"
import { ref } from "vue"

const route = useRoute()

const schema = ref<models.UndefinedSchema>({
    id: undefined,
    name: undefined,
    json: undefined
})

const uploadFile = async () => {

}

const onFileChange = async () => {

}

const getUploadLink = async (paramId: string) => {
    return (await useFetch(`/api/upload-links/${paramId}`)).data.value
}

const getSchema = async (paramId: string | number) => {
    return (await useFetch(`/api/schemas/${paramId}`)).data.value
}

const setSchemaInfo = async () => {
    let uploadLink : models.UploadLink = await getUploadLink(route.params.id)
    schema.value = await getSchema(uploadLink.schema_id)
}

setSchemaInfo()
</script>