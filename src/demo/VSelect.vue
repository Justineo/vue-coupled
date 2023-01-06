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
