import { addComponent } from '@nuxt/kit'
import { defineNuxtModule, addImportsDir, createResolver } from '@nuxt/kit';

export default defineNuxtModule({
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    addComponent({
      name: 'Formatter', // name of the component to be used in vue templates
      filePath: resolver.resolve('Formatter.vue') 
    })

    addComponent({
        name: 'Delimiter', // name of the component to be used in vue templates
        filePath: resolver.resolve('Delimiter.vue') 
      })
  }
})