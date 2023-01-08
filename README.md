# vue-coupled

## Background

See discussion [here](https://gist.github.com/Justineo/3aeb40baff4341b218980dc6318bae17).

This package serves as a POC that:

- Allows any level of component encapsulation for child components.
- Supports dynamically toggling children with `v-if` and re-ordering with `v-for`.
- Support TypeScript.
- Whose implementation details are abstracted away from the consumer components.

## Usage

```sh
npm i --save vue-coupled
```

eg. A `<Select>` / `<Option>` couple:

### `option-group.ts`

```ts
import type { VNode } from 'vue'
import { createCoupled } from 'vue-coupled'

type Option = {
  // props
  value: string | number
  label: string
  disabled?: boolean

  // computed states or slot renderers
  render?: () => VNode
}

export const { useParent, useChild } = createCoupled<Option>()
```

### `Select.vue`

```vue
<script lang="ts">
import { h, defineComponent, renderSlot } from 'vue'
import { useParent } from './option-group'

export default defineComponent({
  setup(_, { slots }) {
    const { children: options } = useParent()
    return () =>
      h('ul', { class: 'select' }, [
        renderSlot(slots, 'default'),
        ...options.value.map((option) =>
          h(
            'li',
            { class: 'option' },
            option.render ? option.render() : option.label
          )
        ),
      ])
  },
})
</script>
```

### `Option.vue`

```vue
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

// Use reactiveComputed from `@vueuse/core` so that we can use computed
// objects instead of refs.
const child = reactiveComputed(() => {
  return {
    ...props,
    render: () => renderSlot(slots, 'default', undefined, () => [props.label]),
  }
})

useChild(child)
</script>

<template>
  <!-- Render a placeholder here -->
  <div v-if="false" />
</template>

```
