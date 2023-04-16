import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useState } from 'react'

export function useBool(): [
  boolean | undefined,
  () => void,
  Dispatch<SetStateAction<boolean | undefined>>,
]
// @ts-expect-error -- it sucks
export function useBool(
  initial: boolean | (() => boolean),
): [boolean, () => void, Dispatch<SetStateAction<boolean>>]
export function useBool(initial?: boolean | (() => boolean)) {
  const [val, setVal] = useState(initial)
  const toggle = useCallback(() => setVal(val => !val), [])
  return [val, toggle, setVal]
}
