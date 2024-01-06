<template>
    <button class="btn text-3xl" v-on:click="show">
        📄
    </button>

    <dialog class="modal" :style="modalStyle">
        <div v-on:click="hide" class="bg-transparent h-full w-full left-0 top-0 absolute pointer"></div>
        <div class="modal-box">
            <h3 class="font-bold text-lg capitalize">{{ mappedField.schemaHeading }} >> {{
                mappedField.dataHeadings[modelIndex] }}</h3>

            <span class="block h-10"></span>

            <div class="flex items-center justify-stretch">
                <div class="basis-32">
                    Field type:
                </div>
                <div class="flex-1">
                    <select v-model="state.status" v-on:change="changeHeader" class="select select-bordered w-full">
                        <option v-for="(key, state) in State" :value="key">{{ state }}</option>
                    </select>
                </div>
            </div>

            <div v-if="typeof mappedField.dataHeadings[modelIndex] === 'object'
                && 'headingName' in mappedField.dataHeadings[modelIndex]">
                <span class="block h-5"></span>

                <div class="flex items-center justify-stretch">
                    <div class="basis-32">
                        Mapped to:
                    </div>
                    <div class="flex-1">
                        <select v-model="mappedField.dataHeadings[modelIndex].headingName"
                            class="select select-bordered w-full">
                            <option v-for="(field) in uploadFields">{{ field }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div v-if="state.status === State.Delimited">
                <span class="block h-5"></span>

                <div class="flex items-center justify-stretch">
                    <div class="basis-32">
                        Delimiter:
                    </div>
                    <div class="flex-1">
                        <Delimiter :data-heading="mappedField.dataHeadings[modelIndex]" />
                    </div>
                </div>
            </div>

            <div v-if="state.status === State.Static">
                <span class="block h-5"></span>

                <div class="flex items-center justify-stretch">
                    <div class="basis-32">
                        Input:
                    </div>
                    <div class="flex-1">
                        <input placeholder="Enter static value" type="text" class="input input-bordered w-full"
                            v-model="mappedField.dataHeadings[modelIndex].static" />
                    </div>
                </div>
            </div>

            <div class="modal-action">
                <button v-on:click="hide" class="btn">Close</button>
            </div>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Mapped, Mapper } from "../transformations/Transformer"

const props = defineProps<{
    uploadFields: string[],
    mappedField: Mapper,
    modelIndex: number
}>()

const emit = defineEmits(['update'])

enum State {
    Simple = "simple",
    Static = "static",
    Delimited = "delimited"
}

let state = ref({ status: State.Simple })
let modalStyle = ref({})

const changeHeader = (event) => {
    updateFieldType(event.target.value)
}

const updateFieldType = (asState: State) => {
    console.log(asState)
    switch (asState) {
        case State.Simple as string:
            state.value.status = State.Simple
            props.mappedField.dataHeadings[props.modelIndex] = {
                type: "simple",
                headingName: props.mappedField.dataHeadings[props.modelIndex].headingName || props.mappedField.dataHeadings[props.modelIndex]
            }
            break;
        case State.Static as string:
            state.value.status = State.Static
            props.mappedField.dataHeadings[props.modelIndex] = {
                type: "static",
                static: props.mappedField.dataHeadings[props.modelIndex]?.static || ""
            }
            break;
        case State.Delimited as string:
            state.value.status = State.Delimited
            props.mappedField.dataHeadings[props.modelIndex] = {
                type: "delimited",
                headingName: props.mappedField.dataHeadings[props.modelIndex].headingName || props.mappedField.dataHeadings[props.modelIndex],
                delimiter: props.mappedField.dataHeadings[props.modelIndex]?.delimiter || "",
                delimitedIndex: props.mappedField.dataHeadings[props.modelIndex]?.delimitedIndex || 0
            }
            break;
    }
}

const show = () => {
    updateFieldType(props.mappedField.dataHeadings[props.modelIndex]?.type as State || State.Simple)
    modalStyle.value = { opacity: 1, "background-color": "rgb(0 0 0 / 63%)", "pointer-events": "all", "margin-left": 0 }
}

const hide = () => {
    modalStyle.value = {}
}


</script>