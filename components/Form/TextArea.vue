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
        <div class="inline-grid grid-cols-2 space-x-4">
            <div>
                <textarea :name="slugify(props.title)" rows="3"
                    class="w-96 border border-purple-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"></textarea>
            </div>
            <div class="max-w-56 italic text-slate-400">
                Add a short description to help others understand what this schema configuration is for.
            </div>
        </div>
    </div>
</template>