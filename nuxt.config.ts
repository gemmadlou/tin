// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/test-utils/module',

    // Load Mappers module
    './modules/mapper',
  ]
  // nitro: {
  //   devServer: {
  //     // My files are under src, if yours are in the root you can change this to ./
  //     watch: ['./']
  //   }
  // }
})