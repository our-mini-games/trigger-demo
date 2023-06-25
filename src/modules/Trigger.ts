import { getRandomId } from '../utils/tools'
import Action from './Action'
import GameObject from './GameObject'

interface ConditionFn<T extends any[] = []> {
  (...args: T): boolean
}

interface TriggerOptions {
  id?: string
  conditions: Array<ConditionFn<[GameObject]>>
  actions: Array<Action>
  once?: boolean
}

export default class Trigger {
  id = getRandomId('Trigger')

  conditions: TriggerOptions['conditions'] = []
  actions: TriggerOptions['actions'] = []
  once: TriggerOptions['once'] = false

  isTriggered = false

  constructor ({
    id,
    once,
    conditions,
    actions
  }: TriggerOptions) {
    this.once = !!once
    this.conditions = conditions
    this.actions = actions

    if (id) {
      this.id = id
    }
  }

  check (source: GameObject) {
    const { conditions } = this

    if (conditions.length === 0) return false

    return conditions.every(condition => condition(source))
  }

  fire (source: GameObject) {
    if (this.isTriggered) return

    if (this.check(source)) {
      source.bindTrigger(this)

      if (this.once) {
        this.isTriggered = this.once
      }
    }
  }
}
