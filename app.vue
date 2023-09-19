<template>
  <form class="p-10" @submit.prevent="createSchema">
    <div class="form-control mb-5">
      <label class="label-text">Schema name</label>
      <input v-model="schema.form.name" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
    </div>

    <div class="form-control mb-5">

      <label class="label">
        <span class="label-text">Create schema</span>
        <a href="https://codebeautify.org/json-to-json-schema-generator" target="_blank">
          <span class="label-text-alt">JSON Schema</span>
        </a>
      </label>
      <textarea v-model="schema.form.schema" class="textarea textarea-bordered h-80 font-mono text-xs" placeholder="JSON Schema"></textarea>
    </div>
    <div class="text-right">
      <button class="btn">Create Schema</button>
    </div>

    <div class=""></div>
  </form>
</template>

<script setup lang="ts">

let schema = {
  form: {
    name: '',
    schema: ''
  },
  success: '',
  error: ''
}

const createSchema = async (event: any) => {
  let body = schema.form
  body.schema = JSON.stringify(JSON.parse(body.schema))

  let response = await $fetch( '/api/schema', {
    method: 'POST',
    body: schema.form.schema
  })

  if (response.error) {
    schema.error = response.error
  }
}
</script>