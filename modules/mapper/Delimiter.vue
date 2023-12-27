<template>
    {{ delimiter }}
    <div class="flex">
        <button class="btn rounded-full text-4xl text-white" v-on:click="open">➗</button>

        <div class="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center -ml-3">
            ↗️
        </div>
    </div>
    <div>
        <input type="text" class="input input-bordered w-16" />
        <select disabled class="select select-bordered w-16">
            <option selected>1</option>
            <option>2</option>
            <option>3</option>
        </select>
        <button class="btn rounded-full text-2xl"
            v-on:click="close">
            ➖
        </button>
    </div>
</template>
<script setup lang="ts">
import * as Machine from "./Delimiter";
import { ref } from "vue"

let delimiter = ref(new Machine.Delimiter("Stark Tower, Manhattan, New York, United States"))


</script>