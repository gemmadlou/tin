<template>
    <Header />

    <div class="container mx-auto p-5">
        <h1 class="text-xl">Links</h1>

        <div class="h-10"></div>

        <div class="grid grid-cols-4 gap-10">
            <div class="col-span-2">
                <table class="table table-zebra">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Name</td>
                            <td>UUID</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="link in links">
                            <th>xxxxx</th>
                            <td>xxxxx</td>
                            <td>xxxxx</td>
                            <td><button @click="viewLink(link)" class="btn btn-outline btn-xs">View</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
let links = ref([])

const viewLink = async (link) => {

}
</script>