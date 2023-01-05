import { isVNode, type VNode } from 'vue'

const STOP = Symbol('stop')
const SKIP = Symbol('skip')

type WalkerResult = typeof STOP | void

type VisitorResult = typeof SKIP | WalkerResult

export function walk(
  root: VNode,
  visit: (node: VNode) => VisitorResult,
  deep = false
): WalkerResult {
  const { children } = root

  const result = visit(root)

  if (result === STOP) {
    return STOP
  }

  if (result === SKIP) {
    return
  }

  if (root.component && deep) {
    if (walk(root.component.subTree, visit, deep) === STOP) {
      return STOP
    }
  } else if (Array.isArray(children) && children.length !== 0) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      if (isVNode(node)) {
        if (walk(node, visit, deep) === STOP) {
          return STOP
        }
      }
    }
  }
}

export function find(
  root: VNode,
  predicate: (node: VNode) => boolean,
  deep = false
): VNode | null {
  let result = null

  walk(
    root,
    (node) => {
      if (predicate(node)) {
        result = node
        return STOP
      }
    },
    deep
  )

  return result
}

let id = 1

export function getId() {
  return id++
}

export function shallowEqual<T>(a1: T[] | null, a2: T[] | null) {
  if (a1 === a2) {
    return true
  }

  if (a1 && a2 && a1.length === a2.length) {
    return a1.every((item, index) => item === a2[index])
  }

  return false
}
