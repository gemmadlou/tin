<template>
    <div class="text-slate-600 relative h-screen flex bg-gradient-to-bl to-purple-50 from-sky-50 border-r-2"
        style="min-width: 960px">

        <nav class="flex h-100 w-16 bg-gradient-to-tr to-purple-950 from-black border-r-2 border-slate-800">

            <div class="text-slate-100 h-100 w-16 flex flex-col justify-center items-stretch">
                <div class="opacity-70 font-bold tracking-widest uppercase p-4">
                    Tin
                </div>

                <div class="flex justify-center mt-auto border-t-2 border-slate-800 p-4">
                    <i class="material-icons">settings</i>
                </div>
            </div>
        </nav>

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
            <div class="mx-auto max-w-screen-xl p-8">
                <h1 class="text-4xl font-semibold leading-relaxed">Schemas</h1>
                <p class="text-lg text-slate-500">
                    Define the structure of data through the schema panel.
                </p>

                <div class="h-10"></div>

                <div class="text-right">
                    <button
                        class="shadow-lg shadow-purple-100 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white p-8 pt-3 pb-3 rounded font-bold">Add
                        new schema
                    </button>
                </div>
                <div class="h-10"></div>

                <div class="rounded-sm overflow-hidden p-8 shadow-md shadow-purple-100 bg-purple-50">
                    <table class=" text-slate-500 rounded-lg overflow-hidden text-left min-w-full divide-y divide-gray-200">
                        <thead class="text-purple-500 uppercase font-bold tracking-wider opacity-70 text-sm">
                            <tr>
                                <th class="px-4 py-2 align-bottom">Schema name</th>
                                <th class="px-4 py-2 align-bottom">Description</th>
                                <th class="px-4 py-2 align-bottom">Created</th>
                                <th class="px-4 py-2"></th>
                                <th class="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2">Address</td>
                                <td class="px-4 py-2">Property address data</td>
                                <td class="px-4 py-2">1 day ago</td>
                                <td class="text-purple-500 px-4 py-2 flex items-center space-x-4 justify-end">
                                    <button>
                                        <span class="material-icons">
                                            edit
                                        </span>
                                    </button>

                                    <button>
                                        <span class="material-icons">
                                            post_add
                                        </span>
                                    </button>

                                    <button>
                                        <span class="material-icons">
                                            delete
                                        </span>
                                    </button>
                                </td>
                                <td class="text-right">

                                    <button
                                        class="text-sm items-center flex space-x-4 ml-auto shadow-lg shadow-purple-100 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white p-6 pt-2 pb-2 rounded font-bold">
                                        <span class="material-icons">
                                            add
                                        </span>
                                        Import new file
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2">Property</td>
                                <td class="px-4 py-2">Property management schema</td>
                                <td class="px-4 py-2">2 days ago</td>
                                <td class="text-purple-500 px-4 py-2 flex items-center space-x-4 justify-end">
                                    <button>
                                        <span class="material-icons">
                                            edit
                                        </span>
                                    </button>

                                    <button>
                                        <span class="material-icons">
                                            post_add
                                        </span>
                                    </button>

                                    <button>
                                        <span class="material-icons">
                                            delete
                                        </span>
                                    </button>
                                </td>
                                <td class="text-right">

                                    <button
                                        class="text-sm items-center flex space-x-4 ml-auto shadow-lg shadow-purple-100 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white p-6 pt-2 pb-2 rounded font-bold">
                                        <span class="material-icons">
                                            add
                                        </span>
                                        Import new file
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>

        <div class="absolute bottom-5 right-5 text-purple-500 opacity-45">
            <span class="material-icons text-3xl">help</span>
        </div>
    </div>
</template>