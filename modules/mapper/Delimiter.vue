<template>
    <div class="flex items-center">
        <input placeholder="eg. ," type="text" class="input input-bordered w-20" v-model="delimiter" />
        <input type="number" v-model="delimiterIndex" class="input input-bordered w-16" />
    </div>
</template>

<script setup lang="ts">
import * as Machine from "./Delimiter";
import { ref } from "vue";

let delimiter = ref("");
let delimiterIndex = ref(0);

</script>
