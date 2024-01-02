import { addComponent } from '@nuxt/kit'
import { defineNuxtModule, addImportsDir, createResolver } from '@nuxt/kit';

export default defineNuxtModule({
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    addComponent({
      name: 'Delimiter',
      filePath: resolver.resolve('Delimiter.vue')
    })

    addComponent({
      name: 'DataHeading',
      filePath: resolver.resolve('DataHeading.vue')
    })

    addComponent({
      name: 'Mapper',
      filePath: resolver.resolve('Mapper.vue')
    })
  }
})