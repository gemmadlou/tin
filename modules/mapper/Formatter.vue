<template>
    {{  formatter._state }}
    <div v-if="(formatter.state() instanceof Machine.ClosedUnformatted)
            || (formatter.state() instanceof Machine.ClosedFormatted)"
        class="flex">
        <button  
            class="btn btn-neutral" 
            v-on:click="open">Open</button>
        
        <div v-if="(formatter.state() instanceof Machine.ClosedFormatted)"
            class="w-5 h-5 bg-gray-300 block">
            ↗️
        </div>
    </div>

    <select v-if="(formatter.state() instanceof Machine.OpenUnformatted)
                || (formatter.state() instanceof Machine.OpenFormatted)"
            v-on:change="selectFormat">
        <option>Select option</option>
        <option>Date</option>
        <option>Email</option>
    </select>

    <button
        v-if="(formatter.state() instanceof Machine.OpenFormatted)
            || (formatter.state() instanceof Machine.OpenUnformatted)"
        class="btn btn-neutral"
        v-on:click="close">Close</button>
</template>

<script setup lang="ts">
import * as Machine from "./Formatter";
import { ref } from "vue"

let formatter = ref(new Machine.Formatter)

const open = () => {
    formatter.value = formatter.value.state().open()
}

const close = () => {
    formatter.value = formatter.value.state().close()
}

const selectFormat = (e) => {
    formatter.value = formatter.value.state().selectFormat(e.target.value)
}

</script>