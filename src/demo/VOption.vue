<script setup lang="ts">
import { renderSlot, useSlots } from 'vue'
import { reactiveComputed } from '@vueuse/core'
import { useChild } from './option-group'

// Vue doesn't support imported type in defineProps transformation yet
type OptionProps = {
  value: string | number
  label: string
  disabled?: boolean
}

const slots = useSlots()

const props = defineProps<OptionProps>()
const child = reactiveComputed(() => {
  return {
    ...props,
    render: () => renderSlot(slots, 'default', undefined, () => [props.label]),
  }
})

useChild(child)
</script>

<template>
  <div v-if="false" />
</template>
