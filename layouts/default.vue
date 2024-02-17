<template>
    <div class="text-slate-600 relative h-screen flex bg-gradient-to-bl to-purple-50 from-sky-50 border-r-2"
        style="min-width: 1080px">

        <nav class="flex h-100 w-16 bg-gradient-to-tr to-purple-950 from-black border-r-2 border-slate-800">

            <div class="text-slate-100 h-100 w-16 flex flex-col justify-center items-stretch">
                <button class="hover:opacity-100 cursor-pointer opacity-80 font-bold tracking-widest uppercase p-4">
                    Tin
                </button>

                <div class="flex justify-center mt-auto border-t-2 border-slate-800 p-4">
                    <button class="cursopr-pointer hover:text-purple-300"><i class="material-icons">settings</i></button>
                </div>
            </div>
        </nav>

        <nav class="w-56 text-slate-800">
            <div class="opacity-70 font-bold tracking-wider uppercase p-4 pl-8 text-purple-900">
                Dashboard
            </div>

            <div class="border-b-2 border-purple-300 w-5 ml-8 "></div>

            <div class="p-8 pt-4 text-sm font-semibold opacity-70">

                <a href="#" class="block py-1 uppercase opacity-80 text-xs mb-3 font-bold">Getting started</a>
                <ul class="space-y-2">
                    <li class="flex items-center space-x-2 hover:text-purple-700">
                        <span class="material-icons">home</span>
                        <a href="#" class="block py-1">Welcome</a>
                    </li>
                    <li class="relative flex items-center space-x-2 text-purple-700">
                        <span class="material-icons">data_object</span>
                        <a href="#" class="block py-1">Schemas</a>
                        <span class="bg-purple-500 h-10 w-1 absolute -right-9 -top-2"></span>
                    </li>
                </ul>

                <div class="h-5"></div>

                <a href="#" class="block py-1 uppercase opacity-80 text-xs mb-3 font-bold">Data</a>
                <ul class="space-y-2">
                    <li class="flex items-center space-x-2 hover:text-purple-700">
                        <span class="material-icons">save</span>
                        <a href="#" class="block py-1">Uploads</a>
                    </li>
                    <li class="flex items-center space-x-2 hover:text-purple-700">
                        <span class="material-icons">tab</span>
                        <a href="#" class="block py-1">Downloads</a>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="shadow-lg flex-1 overflow-y-auto bg-white mt-2 rounded-tl-lg border-t border-l border-slate-100">
            <div class="mx-auto max-w-screen-xl p-8">
                <slot />
            </div>
        </div>

        <div
            class="cursor-pointer absolute bottom-5 right-5 text-purple-500 hover:text-purple-700 hover:opacity-60 opacity-45">
            <span class="material-icons text-3xl">help</span>
        </div>
    </div>
</template>