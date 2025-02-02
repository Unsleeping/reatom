import { Action, action, atom, AtomMut, Ctx } from '@reatom/core'
import { withAssign } from './withAssign'

export interface SetAtom<T> extends AtomMut<Set<T>> {
  add: Action<[el: T], Set<T>>
  delete: Action<[el: T], Set<T>>
  clear: Action<[], Set<T>>
  reset: Action<[], Set<T>>
  has: (ctx: Ctx, el: T) => boolean
  /** @deprecated */
  set: Action<[el: T], Set<T>>
}

export const reatomSet = <T>(
  initState = new Set<T>(),
  name?: string,
): SetAtom<T> =>
  atom(initState, name).pipe(
    withAssign((target, name) => ({
      add: action(
        (ctx, el) =>
          target(ctx, (prev) => (prev.has(el) ? prev : new Set(prev).add(el))),
        `${name}.add`,
      ),
      /** @deprecated */
      set: action(
        (ctx, el) =>
          target(ctx, (prev) => (prev.has(el) ? prev : new Set(prev).add(el))),
        `${name}.set`,
      ),
      delete: action((ctx, el) => {
        return target(ctx, (prev) => {
          if (!prev.has(el)) return prev
          const next = new Set(prev)
          next.delete(el)
          return next
        })
      }, `${name}.delete`),
      clear: action((ctx) => {
        return target(ctx, (prev) => {
          if (prev.size === 0) return prev
          return new Set<T>()
        })
      }, `${name}.clear`),
      reset: action((ctx) => target(ctx, initState), `${name}.reset`),
      has: (ctx: Ctx, el: T) => ctx.get(target).has(el),
    })),
  )
