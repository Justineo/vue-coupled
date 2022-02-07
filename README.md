# vue-coupled

## Background

See discussion [here](https://gist.github.com/Justineo/3aeb40baff4341b218980dc6318bae17).

## Usage

```sh
npm i --save vue-coupled
```

eg. A `<Select>` / `<Option>` couple:

### `option-group.ts`

```ts
import { createCoupled } from 'vue-coupled'

type Option = {
  value: string
  label: string
  disabled?: boolean
}

export const { useParent, useChild } = createCoupled<Option>()
```

### `Select.vue`

```vue
<script setup lang="ts">
import { useParent } from './option-group'

const children = useParent()

// children will be a shallow ref for the reactive options array, whose
// option data is provided by the `Option` component via `useChild`
</script>
```

```vue
<script setup lang="ts">
import { useChild } from './option-group'

// Vue doesn't support imported type in defineProps transformation yet
type Option = {
  value: string
  label: string
  disabled?: boolean
}

const props = defineProps<Option>()

useChild(props)
</script>
```
