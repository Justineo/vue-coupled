<script setup lang="ts">
import { ref } from 'vue'

import Select from './VSelect.vue'
import Option from './VOption.vue'
import Group from './VGroup.vue'

const labelPrefix = ref('')
const if2 = ref(true)
const options = ref([
  { value: 1, label: 'One' },
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' },
])

function togglePrefix() {
  labelPrefix.value = labelPrefix.value ? '' : '@'
}

function toggle2() {
  if2.value = !if2.value
}

function reverse() {
  options.value = options.value.reverse()
}
</script>

<template>
  <Select :size="10">
    <template v-for="(option, i) of options" :key="option.value">
      <Option
        v-if="i !== 1 || if2"
        :value="option.value"
        :label="`${labelPrefix}${option.label}`"
        :key="`#${option.value}`"
        >{{ labelPrefix }}<input type="text" v-model="option.label" /></Option
    ></template>
    <Group />
  </Select>
  <p><button @click="togglePrefix">Change</button>: {{ labelPrefix }}</p>
  <p><button @click="toggle2">Toggle 2</button></p>
  <p><button @click="reverse">Reverse</button></p>
</template>
