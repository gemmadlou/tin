<template>
    <div class="flex items-center">
        <input type="text" class="input input-bordered w-16" v-model="delimiter.delimiter" v-on:change="delimiterUpdate" />
        <select class="select select-bordered w-20 mr-2" v-on:change="selectDelimiterIndex"
            :disabled="delimiter.choiceOfIndices === undefined">
            <option v-for="choice in delimiter.choiceOfIndices">{{ choice }}</option>
        </select>
    </div>
    <input v-if="delimiter.state() instanceof Machine.OpenDelimited && delimiter.selectedText" type="text" disabled :value="delimiter.selectedText"
        class="input input-bordered input-xs w-25 text-center" />
</template>

<script setup lang="ts">
import * as Machine from "./Delimiter";
import { ref } from "vue";

let delimiter = ref(new Machine.Delimiter("Stark Tower, Manhattan, New York, United States"))

const delimiterUpdate = (event) => {
    if (event.target.value) {
        delimiter.value = delimiter.value.state().updateDelimiter(event.target.value)
    } else {
        delimiter.value = delimiter.value.state().removeDelimiter()
    }
}

const selectDelimiterIndex = (event) => {
    delimiter.value = delimiter.value.state().selectDelimiterIndex(event?.target.value)
}

</script>