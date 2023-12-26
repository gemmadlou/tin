<template>
    <button 
        v-if="(formatter.state() instanceof Machine.ClosedUnformatted)" 
        class="btn btn-neutral" v-on:click="formatter.open()">Open</button>

    <button
        v-if="(formatter.state() instanceof Machine.OpenFormatted)
            && (formatter.state() instanceof Machine.OpenUnformatted)" class="btn btn-neutral">Close</button>
</template>

<script setup lang="ts">
import * as Machine from "./Formatter";
import { ref } from "vue"

const formatter = ref(new Machine.Formatter)

</script>