import {
  shallowRef,
  reactive,
  computed,
  provide,
  inject,
  getCurrentInstance,
  onBeforeUnmount,
  onUnmounted,
  onUpdated,
  type Ref,
  type InjectionKey,
  type VNode,
} from 'vue'
import { find, walk, getId } from './utils'

type ChildId = number

type Child = {
  [key: string]: unknown
}

type ParentContext<C> = {
  addChild: (id: ChildId, child: C) => void
  removeChild: (id: ChildId) => void
  children: Ref<C[]>
  unmounting: Ref<boolean>
}

export function createCoupled<C extends Child = Child>() {
  const parentKey = Symbol() as InjectionKey<ParentContext<C>>
  const childKey = Symbol() as InjectionKey<ChildId>

  function useParent() {
    const instance = getCurrentInstance()

    if (!instance) {
      throw new Error('`useParent` must be called within a setup function.')
    }

    const childrenMap = reactive(new Map<ChildId, C>())

    function addChild(id: ChildId, child: C) {
      childrenMap.set(id, child)
    }

    function removeChild(id: ChildId) {
      childrenMap.delete(id)
    }

    function getChildrenFromIds(ids: ChildId[]) {
      return ids.map((id) => {
        const child = childrenMap.get(id)

        if (!child) {
          throw new Error(`Child (id: ${id}) is not found.`)
        }

        return child
      })
    }

    function findAllChildrenIds(root: VNode) {
      const defaultSlot = find(root, ({ key }) => key === '_default')

      if (!defaultSlot) {
        return null
      }

      const childIds: ChildId[] = []

      walk(
        defaultSlot,
        ({ component }) => {
          if (!component) {
            return
          }

          // `provides` is now hidden from types 🤫
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore-next-line
          const id = component.provides[childKey]

          if (id != null) {
            childIds.push(id)
          }
        },
        true
      )

      return childIds
    }

    const items = shallowRef<C[] | null>(null)

    const children = computed(() => {
      return items.value || getChildrenFromIds(Array.from(childrenMap.keys()))
    })

    onUpdated(() => {
      const ids = findAllChildrenIds(instance.subTree)

      if (ids) {
        items.value = getChildrenFromIds(ids)
      } else {
        items.value = null
      }
    })

    const unmounting = shallowRef(false)

    onBeforeUnmount(() => {
      unmounting.value = true
    })

    provide(parentKey, {
      addChild,
      removeChild,
      unmounting,
      children,
    })

    return {
      children,
    }
  }

  function useChild(props: C) {
    const id = getId()

    provide(childKey, id)

    const parent = inject(parentKey)

    if (!parent) {
      throw new Error('No coupled parent found.')
    }

    const { addChild, removeChild, unmounting } = parent

    addChild(id, props)

    onUnmounted(() => {
      if (unmounting.value) {
        return
      }

      removeChild(id)
    })
  }

  return {
    useParent,
    useChild,
  }
}
