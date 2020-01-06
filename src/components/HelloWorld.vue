<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <form @submit.prevent="submit">
      <label class="block">
        <span class="label">User Name</span>
        <Input
          type="text"
          :errors="formErrors.username"
          v-model="fields.username"
        />
      </label>
      <label class="block">
        <span class="label">Password</span>
        <Input
          type="password"
          :errors="formErrors.password"
          v-model="fields.password"
        />
      </label>
      <input type="submit" value="Submit" :disabled="!canSubmit">
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Input from '@/components/Input.vue'
import { isRight } from 'fp-ts/lib/Either'
import { LoginForm, LoginFormValidator } from '@/utils/validators/login'
import { range } from '@/utils/helper'

interface IData {
  fields: LoginForm
}

type FormErrors = { [key in keyof LoginForm]: string[] }

export default Vue.extend({
  name: "HelloWorld",
  components: {
    Input
  },
  props: {
    msg: String
  },
  data(): IData {
    return {
      fields: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    formErrors(): FormErrors {
      const empty: FormErrors = {
        password: [],
        username: []
      }
      const result = LoginFormValidator(this.fields)

      return isRight(result) ? empty : result.left as FormErrors
    },
    canSubmit(): boolean {
      const hasErrors = Object.values(this.formErrors).some(field => field.length !== 0)
      return !hasErrors
    },
    maskedPassword(): string {
      const { password } = this.fields
      if (!password || password.length < 4) return ''
      const head = range(0, password.length - 3).map(_ => '*')
      const tail = password.slice(password.length - 2, password.length)
      return [...head, ...tail].join('')
    }
  },
  methods: {
    submit() {

      const message = `
        Posting these info...
        username: ${this.fields.username}
        password: ${this.maskedPassword}
      `

      alert(message)
    }
  }
});
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
a {
  color: #42b983;
}

.label {
  margin-bottom: 8px;
  font-size: 18px;
  display: block;
}

.block {
  margin-top: 24px;
}

input[type="submit"] {
  margin-top: 24px;
  font-size: 36px;
}

input[type="submit"][disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
