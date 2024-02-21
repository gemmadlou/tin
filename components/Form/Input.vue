<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true }
})
</script>

<template>
    <div>
        <label class="block font-bold">
            {{ props.title }}
        </label>
        <input type="text" :name="slugify(props.title)"
            class="w-96 border border-purple-500 h-10 px-4 rounded-lg text-sm focus:outline-none focus:border-purple-500">
    </div>
</template>