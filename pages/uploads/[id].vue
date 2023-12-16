<template>
    <Header />

    <div class="container mx-auto p-5">
        <h1 class="text-xl">Import your data file</h1>

        <div class="h-10"></div>

        <div class="max-w-4xl grid grid-cols-4 gap-10">
            <div class="col-span-1 flex items-center justify-center bg-gray-100 rounded-lg">
                <div class="flex items-center">
                    <div class="mr-3 uppercase font-bold">Step</div>
                    <div class="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center">
                        1
                    </div>
                </div>
            </div>
            <div class="col-span-3">
                <form class="flex" @submit.prevent="uploadFile">
                    <div class="mr-3 form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">Pick a data file eg. csv</span>
                        </label>
                        <input type="file" v-on:change="onFileChange"
                            class="file-input file-input-bordered w-full max-w-xs" />
                    </div>
                    <div class="self-end">
                        <button type="submit" class="btn">Upload</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="h-10"></div>

        <div>
            Step 2 - Map file
        </div>

        <div class="h-10"></div>

        <div>
            Step 3 - Import file
        </div>
    </div>
</template>

<script>
const uploadFile = async () => {

}

const onFileChange = async () => {

}
</script>