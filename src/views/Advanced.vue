<template>
  <div class="home">
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
import { isRight } from 'fp-ts/lib/Either'
import Input from '@/components/Input.vue'
import { FormErrors } from '@/lib/validation'
import { LoginForm, LoginFormValidator } from '@/utils/validators/login'
import { maskStr } from '@/utils/helper'

interface IData {
  fields: LoginForm
}

export default Vue.extend({
  name: "home",
  components: {
    Input
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
    formErrors(): FormErrors<LoginForm> {
      const empty: FormErrors<LoginForm> = {
        password: [],
        username: []
      }
      const result = LoginFormValidator(this.fields)

      return isRight(result) ? empty : result.left as FormErrors<LoginForm>
    },
    canSubmit(): boolean {
      const hasErrors = Object.values(this.formErrors).some(field => field.length !== 0)
      return !hasErrors
    }
  },
  methods: {
    submit() {

      const message = `
        Posting these info...
        username: ${this.fields.username}
        password: ${maskStr(this.fields.password)}
      `

      alert(message)
    }
  }
});
</script>


<style scoped>
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
