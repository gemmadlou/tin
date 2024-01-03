<template>
    <div class="flex items-center">
        <input placeholder="eg. ," type="text" class="input input-bordered w-20" v-model="props.dataHeading.delimiter" />
        <input type="number" v-model="props.dataHeading.delimitedIndex" class="input input-bordered w-16 pr-2" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { DataHeadingDelimiter } from "../transformations/Transformer";
let props = defineProps<{ dataHeading: DataHeadingDelimiter }>()

</script>
