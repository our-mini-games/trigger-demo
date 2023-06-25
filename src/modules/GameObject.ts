import { ActionTypes, GameObjectTypes } from '../config/definitions'
import { getRandomId } from '../utils/tools'
import Action from './Action'
import { Point } from './Renderer'
import Shape from './Shape'
import Trigger from './Trigger'

export interface GameObjectOptions {
  id?: string
  type: GameObjectTypes
  shape: Shape
}

export default class GameObject {
  id = getRandomId('GameObject')

  type!: GameObjectOptions['type']
  shape!: GameObjectOptions['shape']

  actions = new Map<ActionTypes, Action>()
  triggerIds = new Set<string>()

  parentCollection = new Map<string, GameObject>()

  constructor (options: GameObjectOptions) {
    Object.assign(this, options)
  }

  init (parentCollection: Map<string, GameObject>) {
    this.parentCollection = parentCollection

    parentCollection.set(this.id, this)
  }

  update () {
    this.shape.update()

    this.actions.forEach(action => action.exec(this))
  }

  loadAction (actionType: ActionTypes, action: Action) {
    this.actions.set(actionType, action)
  }

  unloadAction (actionType: ActionTypes) {
    this.actions.delete(actionType)
  }

  bindTrigger (trigger: Trigger) {
    if (this.triggerIds.has(trigger.id)) return

    this.triggerIds.add(trigger.id)

    trigger.actions.forEach(action => {
      this.loadAction(action.type, action)
    })
  }

  unbindTrigger (trigger: Trigger) {
    this.triggerIds.delete(trigger.id)
  }

  moveTo (target: GameObject) {
    const {
      shape: {
        midpoint: { x: x1, y: y1 }
      }
    } = this
    const {
      shape: {
        midpoint: { x: x2, y: y2 }
      }
    } = target

    const speed = 3

    if (x1 === x2 && y1 === y2) return

    if (x1 === x2) {
      this.shape.setMidpoint(new Point(x1, y1 > y2 ? y1 - speed : y1 + speed ))
      return
    }

    if (y1 === y2) {
      this.shape.setMidpoint(new Point(x1 > x2 ? x1 - speed : x1 + speed, y1))
      return
    }

    this.shape.setMidpoint(new Point(
      x1 > x2 ? x1 - speed : x1 + speed,
      y1 > y2 ? y1 - speed : y1 + speed
    ))
  }

  destroy () {
    const { parentCollection } = this
    if (!parentCollection) return

    let delKey = ''

    parentCollection.forEach((val, key) => {
      if (val === this) {
        delKey = key
      }
    })

    if (delKey) {
      parentCollection.delete(delKey)
    }
  }
}