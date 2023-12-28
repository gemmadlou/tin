<template>
    {{ delimiter }}
    <div v-if="(delimiter.state() instanceof Machine.ClosedDelimited)
        || (delimiter.state() instanceof Machine.ClosedUndelimited)" class="flex">
        <button class="btn rounded-full text-4xl text-white" v-on:click="open">➗</button>

        <div class="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center -ml-3">
            ↗️
        </div>
    </div>
    <div v-if="
        delimiter.state() instanceof Machine.OpenUndelimited
        || delimiter.state() instanceof Machine.OpenDelimited
    ">
        <input 
            type="text" 
            class="input input-bordered w-16" 
            v-model="delimiter.delimiter"
            v-on:change="delimiterUpdate"
        />
        <select class="select select-bordered w-20" :disabled="delimiter.choiceOfIndices === undefined">
            <option v-for="choice in delimiter.choiceOfIndices">{{ choice }}</option>
        </select>
        <button class="btn rounded-full text-2xl"
            v-on:click="close">
            ➖
        </button>
    </div>
</template>

<script setup lang="ts">
import * as Machine from "./Delimiter";
import { ref } from "vue";

let delimiter = ref(new Machine.Delimiter("Stark Tower, Manhattan, New York, United States"))

const open = () => {
    delimiter.value = delimiter.value.state().open()
}

const close = () => {
    delimiter.value = delimiter.value.state().close()
}

const delimiterUpdate = (event) => {
    if (event.target.value) {
        delimiter.value = delimiter.value.state().updateDelimiter(event.target.value)
    } else {
        delimiter.value = delimiter.value.state().removeDelimiter()
    }
}

</script>