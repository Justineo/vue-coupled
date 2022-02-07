import { isVNode, type VNode } from 'vue'

type WalkerResult = 'stop' | void

type VisitorResult = 'skip' | WalkerResult

export function walk(
  root: VNode,
  visit: (node: VNode) => VisitorResult,
  deep = false
): WalkerResult {
  const { children } = root

  const result = visit(root)

  if (result === 'stop') {
    return 'stop'
  }

  if (result === 'skip') {
    return
  }

  if (root.component && deep) {
    if (walk(root.component.subTree, visit, deep) === 'stop') {
      return 'stop'
    }
  } else if (Array.isArray(children) && children.length !== 0) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      if (isVNode(node)) {
        if (walk(node, visit, deep) === 'stop') {
          return 'stop'
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
        return 'stop'
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
