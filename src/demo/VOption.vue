<script setup lang="ts">
import { renderSlot, useSlots, type VNode } from 'vue'
import { reactiveComputed } from '@vueuse/core'
import { useChild } from './option-group'

// Vue doesn't support imported type in defineProps transformation yet
type Option = {
  value: string | number
  label: string
  disabled?: boolean
  render?: () => VNode | string
}

const slots = useSlots()

const props = defineProps<Option>()
const child = reactiveComputed(() => {
  return {
    ...props,
    render: () => renderSlot(slots, 'default') || props.label,
  }
})

useChild(child)
</script>

<template>
  <div v-if="false" />
</template>
