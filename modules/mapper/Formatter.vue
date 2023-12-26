<template>
    <div v-if="(formatter.state() instanceof Machine.ClosedUnformatted)
        || (formatter.state() instanceof Machine.ClosedFormatted)" class="flex">
        <button class="btn rounded-full text-4xl" v-on:click="open">📄</button>

        <div v-if="(formatter.state() instanceof Machine.ClosedFormatted)" class="w-5 h-5 bg-gray-300 block">
            ↗️
        </div>
    </div>

    <select v-if="(formatter.state() instanceof Machine.OpenUnformatted)
        || (formatter.state() instanceof Machine.OpenFormatted)"
        class="select select-bordered w-full max-w-xs mr-5"
        v-on:change="selectFormat">
        <option>Select option</option>
        <option v-for="(option, name) of options">{{ name }}</option>
        <option>Email</option>
    </select>

    <button v-if="(formatter.state() instanceof Machine.OpenFormatted)
        || (formatter.state() instanceof Machine.OpenUnformatted)" class="btn rounded-full"
        v-on:click="close">❌</button>
</template>

<script setup lang="ts">
import * as Machine from "./Formatter";
import { ref } from "vue"

let formatter = ref(new Machine.Formatter)
let options = Machine.Format

const open = () => {
    formatter.value = formatter.value.state().open()
}

const close = () => {
    formatter.value = formatter.value.state().close()
}

const selectFormat = (e) => {
    if (Object.keys(Machine.Format).includes(e.target.value)) {
        formatter.value = formatter.value.state().selectFormat(e.target.value)
    } else {
        formatter.value = formatter.value.state().removeFormat()
    }
}

</script>