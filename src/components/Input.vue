<template>
  <div class="wrapper" :class="{ hasError: hasError }">
    <input
      :id="id"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :minlength="minlength"
      :maxlength="maxlength"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="disableAutocomplete ? 'off' : 'on'"
      :list="listId"
      :name="name"
      :pattern="pattern"
      :title="title"
      :required="required"
      class="Input"
      v-on="inputListeners"
    />
    <datalist v-if="hasCandiates" :id="listId">
      <option v-for="candidate in candidates" :key="candidate" :value="candidate" />
    </datalist>
    <ul v-if="hasError" class="errors">
      <li v-for="(error, i) in errors" :key="i" class="error">{{ error }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { oneOf } from '@/utils/helper'

export default Vue.extend({
  props: {
    candidates: {
      type: Array as () => string[],
      default: () => []
    },
    type: {
      type: String,
      default: 'text',
      validator: oneOf(['text', 'search', 'tel', 'email', 'date', 'password', 'url', 'time', 'number', 'file'])
    },
    placeholder: {
      type: String,
      default: null
    },
    maxlength: {
      type: Number,
      default: null
    },
    minlength: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    listId: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    pattern: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    errors: {
      type: Array as () => string[],
      default: () => []
    },
    outputType: {
      type: String,
      default: 'string',
      validator: oneOf(['string', 'number'])
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasCandiates(): boolean {
      return this.candidates.length > 0
    },
    disableAutocomplete(): boolean {
      return this.hasCandiates || this.type === 'password'
    },
    hasError(): boolean {
      return this.errors.length > 0
    },
    inputListeners(): Record<string, Function | Function[]> {
      const vm = this
      const data = {
        ...this.$listeners,
        input(e: { target: { value: string } }) {
          vm.handleInput(vm, e.target.value)
        }
      }
      return data
    }
  },
  methods: {
    numerify(val: string | null): number | null {
      return val === null ? null : Number(val)
    },
    handleInput<T extends Vue>(vm: T, value: string) {
      const trim = value.trim()
      vm.$emit('input', this.outputType === 'number' ? this.numerify(trim) : trim)
    }
  }
})
</script>

<style scoped>
.wrapper {
  position: relative;
}

.Input {
  background: #fff;
}

input[type='text'],
input[type='number'],
input[type='email'],
input[type='password'],
input[type='search'] {
  font-size: 15px;
  background: #FFFFFF;
  line-height: 32px;
  width: 312px;
  height: 32px;
  padding: 0px 8px 0px 8px;
  margin: 0px;
  border-top: 2px solid #AAAAAA;
  border-right: 2px solid #CCCCCC;
  border-bottom: 2px solid #CCCCCC;
  border-left: 2px solid #AAAAAA;
}

.Input[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
.Input[readonly] {
  opacity: 0.7;
  cursor: not-allowed;
}

input[type='file'] {
  display: none;
}

.hasError > input,
.hasError > input:focus {
  position: relative;
  border: solid 2px #AA0000;
}

ul {
  list-style: none;
}

.errors {
  color: #AA0000;
  font-weight: bold;
  font-size: 18px;
  margin: 8px 0 0;
}
</style>
