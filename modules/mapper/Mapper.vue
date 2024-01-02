<script setup lang="ts">
import { ref } from "vue";
import type { Mapped } from "../transformations/Transformer";
import axios from "axios"

const props = defineProps(['schema', 'extractedFileData', 'linkId']);

let mappedFields = ref<Mapped[]>([])

type Mapper = {
    required: string[],
    schemaFields: string[],
    uploadFields: string[]
}

let mapper = ref<Mapper>({
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

const addNewField = (mappedField: Mapped) => {
    mappedField.dataValues.push(mapper.value.uploadFields[0])
}

const removeNewField = async (mappedField: Mapped, index: number) => {
    mappedField.dataValues.splice(index, 1)
}

// @todo vue 3.4 - add simpler v-model once Nuxt releases it
const modelValue = (schemaHeading, mappingsIndex, value) => {
    mappedFields.value[schemaHeading][mappingsIndex] = value
}

const getUploadLink = async (paramId: string | number) => {
    return (await axios.get(`/api/schema-uploads/${paramId}`)).data
}

const createMapperUi = async () => {
    let schemeFields = Object.keys(props.schema?.json?.properties)
    let uploadFields = Object.keys(props.extractedFileData[0].json).filter(i => i)

    mappedFields.value = schemeFields.reduce((mapped: Mapped[], schemaHeading: string) => {
        mapped.push({
            schemaHeading,
            dataValues: [uploadFields[0]]
        })
        return mapped
    }, [])

    mapper.value.required = props.schema?.json?.required
    mapper.value.schemaFields = schemeFields
    mapper.value.uploadFields = uploadFields

    link.value = await getUploadLink(props.linkId)

    // @todo get from database
    // let mapperEntity = (await useFetch(`/api/mappers/${link.value.mapper_id}`)).data.value
    // mappedFields.value = mapperEntity.config
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

                <div v-for="(values, dataValueIndex) in mappedField.dataValues" :key="dataValueIndex">
                    <div class="flex space-x-8">
                        <DataHeading :upload-fields="mapper.uploadFields" :mapped-field="mappedField"
                            :model-index="dataValueIndex" v-on:update="modelValue" />

                        <select v-model="mappedField.dataValues[dataValueIndex]" class="select select-bordered w-44">
                            <option v-for="(field) in mapper.uploadFields">{{ field }}</option>
                        </select>

                        <div class="flex space-x-2">
                            <button v-on:click="addNewField(mappedField)" class="btn">✚</button>
                            <button v-if="mappedField.dataValues.length > 0 || !isRequiredField(mappedField.schemaHeading)"
                                v-on:click="removeNewField(mappedField, dataValueIndex)" class="btn">-</button>
                        </div>
                    </div>
                </div>
                <div v-if="mappedField.dataValues.length === 0">
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