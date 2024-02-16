<template>
    <div class="h-screen flex bg-gradient-to-bl to-purple-50 from-sky-50 border-r-2" style="min-width: 960px">
        <!-- Slim Sidebar with Icons -->
        <nav class="flex h-100 w-16 bg-gradient-to-tr to-purple-950 from-black border-r-2 border-slate-800">
            <!-- Sidebar Content with Icons -->
            <div class="text-slate-100 h-100 w-16 flex flex-col justify-center items-stretch">
                <div class="opacity-70 font-bold tracking-widest uppercase p-4">
                    Tin
                </div>

                <div class="flex justify-center mt-auto border-t-2 border-slate-800 p-4">
                    <i class="material-icons">settings</i>
                </div>
            </div>
        </nav>
        <!-- Fatter Sidebar with Links -->
        <nav class="w-56 text-slate-800">
            <div class="opacity-70 font-bold tracking-wider uppercase p-4 pl-8 text-purple-900">
                Dashboard
            </div>

            <div class="border-b-2 border-purple-300 w-5 ml-8 "></div>

            <div class="p-8 pt-4 text-sm font-semibold opacity-70">

                <a href="#" class="block py-1 uppercase opacity-80 text-xs mb-3 font-bold">Schema Panel</a>
                <ul class="space-y-2">
                    <li class="relative flex items-center space-x-2 text-purple-700">
                        <span class="material-icons">data_object</span>
                        <a href="#" class="block py-1">Schemas</a>
                        <span class="bg-purple-500 h-10 w-1 absolute -right-9 -top-2"></span>
                    </li>
                </ul>

                <div class="h-5"></div>

                <a href="#" class="block py-1 uppercase opacity-80 text-xs mb-3 font-bold">Data</a>
                <ul class="space-y-2">
                    <li class="flex items-center space-x-2"><span class="material-icons">save</span><a href="#"
                            class="block py-1">Uploads</a></li>
                    <li class="flex items-center space-x-2"><span class="material-icons">tab</span><a href="#"
                            class="block py-1">Downloads</a></li>
                </ul>
            </div>
        </nav>

        <div class="shadow-lg flex-1 overflow-y-auto bg-white mt-2 rounded-tl-lg border-t border-l border-slate-100">
            <!-- Main Content goes here -->
        </div>
    </div>
</template>