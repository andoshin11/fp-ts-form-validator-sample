<template>
  <div class="home">
    <form @submit.prevent="submit">
      <label class="block">
        <span class="label">User Name</span>
        <Input
          type="text"
          :errors="formErrors.username"
          v-model="fields.username"
          @blur="enableCheck('username')"
        />
      </label>
      <label class="block">
        <span class="label">Password</span>
        <Input
          type="password"
          :errors="formErrors.password"
          v-model="fields.password"
          @blur="enableCheck('password')"
        />
      </label>
      <input type="submit" value="Submit" :disabled="!canSubmit" />
    </form>
    <div class="visualized">
      <RawData :data="{ data: { fields, enableCheckFlg }, formErrors }" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { isRight } from "fp-ts/lib/Either";
import Input from "@/components/Input.vue";
import RawData from "@/components/RawData";
import { FormErrors } from "@/lib/validation";
import { LoginForm, LoginFormValidator } from "@/utils/validators/login";
import { maskStr, createEmptyFormErrors } from "@/utils/helper";

interface IData {
  fields: LoginForm;
  enableCheckFlg: { [key in keyof LoginForm]: boolean };
}

export default Vue.extend({
  name: "home",
  components: {
    Input,
    RawData
  },
  data(): IData {
    return {
      fields: {
        username: "",
        password: ""
      },
      enableCheckFlg: {
        username: false,
        password: false
      }
    };
  },
  computed: {
    formErrors(): FormErrors<LoginForm> {
      const { enableCheckFlg } = this;
      const empty = createEmptyFormErrors(this.fields);
      const result = LoginFormValidator(this.fields);

      if (isRight(result)) {
        return empty;
      } else {
        // use default value for the fields where associated enableCheckFlg == false
        return Object.keys(result.left).reduce((acc, ac) => {
          const field = ac as keyof LoginForm;
          if (enableCheckFlg[field]) acc[field] = result.left[ac];
          return acc;
        }, empty);
      }
    },
    canSubmit(): boolean {
      const hasErrors = Object.values(this.formErrors).some(
        field => field.length !== 0
      );
      return !hasErrors;
    }
  },
  methods: {
    submit() {
      this.enableAllChecks();
      if (!this.canSubmit) return;

      const message = `
        Posting these info...
        username: ${this.fields.username}
        password: ${maskStr(this.fields.password)}
      `;

      alert(message);
    },
    enableCheck(str: keyof LoginForm) {
      this.enableCheckFlg[str] = true;
    },
    enableAllChecks() {
      Object.keys(this.fields).forEach(field =>
        this.enableCheck(field as keyof LoginForm)
      );
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
