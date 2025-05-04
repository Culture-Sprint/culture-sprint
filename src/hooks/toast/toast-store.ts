
import { State, Action } from "./types"
import { reducer } from "./toast-reducer"

export const listeners: ((state: State) => void)[] = []

export let memoryState: State = { toasts: [] }

export function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}
