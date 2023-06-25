import { ActionTypes, GameObjectTypes } from '../config/definitions'
import { getRandomId } from '../utils/tools'
import GameObject from './GameObject'
import Shape, { ShapeOptions } from './Shape'

interface ActionOptions {
  type: ActionTypes
  source?: GameObject
  target?: unknown
  callback?: ActionCallback
}

interface ActionCallback {
  (...args: any[]): void
}

export default class Action {
  id = getRandomId('Action')

  type!: ActionOptions['type']
  source: ActionOptions['source']
  target: ActionOptions['target']
  callback: ActionOptions['callback']

  constructor (options: ActionOptions) {
    Object.assign(this, options)
  }

  execCheck () {
    return true
  }

  exec (source?: GameObject) {
    if (source) {
      this.source = source
    }
    if (!this.execCheck()) return

    const { callback } = this
    switch (this.type) {
      case ActionTypes.CREATE:
        if (this.source && this.target) {
          const { type, shapeOptions } = this.target as {
            type: GameObjectTypes
            shapeOptions: ShapeOptions
          }
          const gameObject = new GameObject({ type, shape: new Shape(shapeOptions) })
          callback?.(gameObject)
        }
        break
      case ActionTypes.DESTROY:
        this.source?.destroy()
        break
      case ActionTypes.MOVE_TO:
        if (this.source && this.target) {
          this.source.moveTo(this.target as GameObject)
        }
        break
    }
  }
}

export class IntervalAction extends Action {
  immediate = true
  lastTime = new Date().getTime()

  interval = 0

  constructor (options: ActionOptions & { interval: number, immediate?: boolean }) {
    const { interval, immediate, ...actionOptions } = options

    super(actionOptions)

    this.interval = interval
    this.immediate = !!immediate

    if (immediate) {
      this.lastTime = -Infinity
    }
  }

  execCheck () {
    const currentTime = new Date().getTime()

    if (currentTime - this.lastTime > this.interval) {
      this.lastTime = currentTime
      return true
    }

    return false
  }
}
