<script setup lang="ts">
import type { Mapper } from "../transformations/Transformer";
import {Sdk} from "../../packages/uploads"
import axios from "axios";
import { ref } from "vue";

const props = defineProps(['schema', 'extractedFileData', 'linkId']);

let mappedFields = ref<Mapper[]>([])

type iMapper = {
    required: string[],
    schemaFields: string[],
    uploadFields: string[]
}

let mapper = ref<iMapper>({
    required: [],
    schemaFields: [],
    uploadFields: []
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
});

const isRequiredField = (schema: string) => {
    return false
}

const addNewField = (mappedField: Mapper) => {
    mappedField.dataHeadings.push({
        headingName: mapper.value.uploadFields[0]
    })
}

const removeNewField = async (mappedField: Mapper, index: number) => {
    mappedField.dataHeadings.splice(index, 1)
}

// @todo vue 3.4 - add simpler v-model once Nuxt releases it
const modelValue = (schemaHeading, mappingsIndex, value) => {
    mappedFields.value[schemaHeading][mappingsIndex] = value
}

const createMapperUi = async () => {
    let schemeFields = Object.keys(props.schema?.json?.properties)
    let uploadFields = Object.keys(props.extractedFileData[0].json).filter(i => i)

    mappedFields.value = schemeFields.reduce((mapper: Mapper[], schemaHeading: string) => {
        mapper.push({
            schemaHeading,
            dataHeadings: [{
                headingName: uploadFields[0]
            }]
        })
        return mapper
    }, [])

    mapper.value.required = props.schema?.json?.required
    mapper.value.schemaFields = schemeFields
    mapper.value.uploadFields = uploadFields

    link.value = await Sdk.schemaUploads.get(props.linkId)

    let mapperEntity = (await useFetch(`/api/mappers/${link.value.mapper_id}`)).data.value
    mappedFields.value = mapperEntity.config
}

const saveMapper = async () => {
    let data = {
        config: mappedFields.value
    }

    let response = (await axios.post('/api/mappers', data)).data;

    await axios.put(`/api/schema-uploads/${link.value.id}`, {
        ...link.value,
        name: link.value.name,
        upload_id: link.value.upload_id,
        mapper_id: response.id
    })

    createMapperUi()
}

onMounted(async () => {
    await createMapperUi()
})

</script>

<template>
    <table v-for="(mappedField, mappedFieldIndex) in mappedFields" :key="mappedField.schemaHeading"
        class="table table-zebra w-full max-w-md">
        <tr>
            <td class="w-32 capitalize">
                <div class="w-32">
                    {{ mappedField.schemaHeading }}
                    <span v-if="isRequiredField(mappedField.schemaHeading)">*</span>
                </div>
            </td>
            <td>

                <div v-for="(values, dataValueIndex) in mappedField.dataHeadings" :key="dataValueIndex">
                    <div class="flex space-x-8">
                        <DataHeading 
                            :upload-fields="mapper.uploadFields" 
                            :mapped-field="mappedField"
                            :model-index="dataValueIndex" 
                            v-on:update="modelValue" />

                        <select v-model="mappedField.dataHeadings[dataValueIndex].headingName" class="select select-bordered w-44">
                            <option v-for="(field) in mapper.uploadFields">{{ field }}</option>
                        </select>

                        <div class="flex space-x-2">
                            <button v-on:click="addNewField(mappedField)" class="btn">✚</button>
                            <button v-if="mappedField.dataHeadings.length > 0 || !isRequiredField(mappedField.schemaHeading)"
                                v-on:click="removeNewField(mappedField, dataValueIndex)" class="btn">-</button>
                        </div>
                    </div>
                </div>
                <div v-if="mappedField.dataHeadings.length === 0">
                    <button v-on:click="addNewField(mappedField)" class="btn">✚</button>
                </div>
            </td>
        </tr>
    </table>

    <div class="h-5"></div>

    <div class="text-right">
        <button class="btn btn-neutral" v-on:click="saveMapper">Save Mapper</button>
    </div>
</template>