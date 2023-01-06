import type { VNode } from 'vue'
import { createCoupled } from '../index'

type Option = {
  value: string | number
  label: string
  disabled?: boolean
  render?: () => VNode
}

export const { useParent, useChild } = createCoupled<Option>()
