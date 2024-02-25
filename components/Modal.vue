<template>
    <div v-if="showModal" class="fixed top-0 left-0 h-full w-full flex flex-col justify-center items-center">
        <!-- Background overlay -->
        <div class="absolute top-0 left-0 h-full w-full bg-slate-800 opacity-80" @click="$emit('closeModal')"></div>
        {{ showModal }}
        <!-- Modal container -->
        <div class="border-t-4 border-red-500 relative bg-white rounded-lg shadow-md p-8 max-w-96">
            <div class="flex space-x-5 items-start mb-3">
                <div class="shrink-0 bg-red-500 h-16 w-16 rounded-full flex justify-center items-center">
                    <span class="text-4xl material-icons text-white">delete</span>
                </div>
                <div>
                    <!-- Modal header -->
                    <div class="flex justify-between items-center border-b pb-4 mb-4">
                        <h2 class="text-xl font-semibold">{{ title }}</h2>
                    </div>

                    <!-- Modal body -->
                    <p class="text-sm mb-4">{{ message }}</p>
                </div>
            </div>
            <!-- Modal footer -->
            <div class="grid grid-cols-2 space-x-5">
                <button class="px-4 py-2 bg-white border border-slate-800 text-slate-800 rounded-md"
                @click="$emit('closeModal')">{{ cancelText  }}</button>
                <button class="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
                @click="$emit('deleteItem')">{{ confirmText }}</button>
            </div>
        </div>

        <div v-if="failureMessage" class="mt-2 w-full bg-red-500 text-white relative rounded-lg shadow-md p-8 pt-4 pb-4 max-w-96">
            {{ failureMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineEmits(['closeModal', 'deleteItem'])

const props = defineProps({
    showModal: Boolean,
    title: {
        type: String,
        default: 'Confirm deletion'
    },
    message: {
        type: String,
        default: 'Are you sure you want to delete this item?'
    },
    cancelText: {
        type: String,
        default: 'Cancel'
    },
    confirmText: {
        type: String,
        default: 'Delete schema'
    },
    failureMessage: String
});
</script>