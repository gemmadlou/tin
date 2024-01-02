<template>
    <button class="btn text-3xl" v-on:click="show">
        📄
    </button>

    <dialog class="modal" :style="modalStyle">
        <div v-on:click="hide" class="bg-transparent h-full w-full left-0 top-0 absolute pointer"></div>
        <div class="modal-box">
            <h3 class="font-bold text-lg capitalize">{{ mappedField.schemaHeading }} >> {{ mappedField.dataValues[modelIndex] }}</h3>

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

            <span class="block h-5"></span>

            <div class="flex items-center justify-stretch">
                <div class="basis-32">
                    Mapped to:
                </div>
                <div class="flex-1">
                    <select v-model="mappedField.dataValues[modelIndex]" class="select select-bordered w-full">
                        <option v-for="(field) in uploadFields">{{ field }}</option>
                    </select>
                </div>
            </div>

            <span class="block h-5"></span>

            <div v-if="state.status === State.Delimited" class="flex items-center justify-stretch">
                <div class="basis-32">
                    Delimiter:
                </div>
                <div class="flex-1">
                    <Delimiter />
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
import type { Mapped } from "../transformations/Transformer"

const props = defineProps<{
    uploadFields: string[],
    mappedField: Mapped,
    modelIndex?: number
}>()

const emit = defineEmits(['update'])

enum State {
    Simple = "simple",
    Delimited = "delimited"
}

const useDelimited = () => ({
    status: State.Delimited
})

const useSimple = () => ({
    status: State.Simple
})

let state = ref(useSimple())
let modalStyle = ref({})

const changeHeader = (event) => {
    switch (event.target.value) {
        case State.Simple as string: state.value = useSimple(); break;
        case State.Delimited as string: state.value = useDelimited(); break;
    }
}

const show = () => {
    modalStyle.value = { opacity: 1, "background-color": "rgb(0 0 0 / 63%)", "pointer-events": "all", "margin-left": 0 }
}

const hide = () => {
    modalStyle.value = {}
}

</script>