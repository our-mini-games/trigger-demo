import { ActionTypes, GameObjectTypes, ShapeTypes } from '../config/definitions'
import Action, { IntervalAction } from './Action'
import GameObject from './GameObject'
import Renderer, { Point } from './Renderer'
import Shape from './Shape'
import Trigger from './Trigger'

export default class CentralControlSystem {
  el: HTMLElement

  triggers = new Set<Trigger>()
  gameObjects = new Map<string, GameObject>()
  renderers = new Map<string, Renderer>()

  requestId = 0

  constructor (el: string | HTMLElement) {
    this.el = typeof el === 'string'
      ? document.querySelector<HTMLElement>(el)!
      : el
  }

  init () {
    this.loadRenderers()
    this.loadGameObjects()
    this.loadTriggers()
  }

  loadRenderers () {
    const mainRenderer = new Renderer(48 * 8, 48 * 8)
    this.renderers.set('Main', mainRenderer)

    mainRenderer.mount(this.el)
  }

  loadGameObjects () {
    const { gameObjects } = this
    const size = 48

    const inputArea = new GameObject({
      id: 'inputArea',
      type: GameObjectTypes.Area,
      shape: new Shape({
        type: ShapeTypes.Rectangle,
        midpoint: new Point(8 * size - size / 2, size / 2),
        width: size,
        height: size,
        fill: 'green',
        alpha: 0
      })
    })

    const inflectionPoint1 = new GameObject({
      id: 'inflectionPoint1',
      type: GameObjectTypes.Area,
      shape: new Shape({
        type: ShapeTypes.Rectangle,
        midpoint: new Point(size / 2, size / 2),
        width: size,
        height: size,
        fill: 'blue',
        alpha: 0
      })
    })

    const inflectionPoint2 = new GameObject({
      id: 'inflectionPoint2',
      type: GameObjectTypes.Area,
      shape: new Shape({
        type: ShapeTypes.Rectangle,
        midpoint: new Point(size / 2, 8 * size - size / 2),
        width: size,
        height: size,
        fill: 'blue',
        alpha: 0
      })
    })

    const inflectionPoint3 = new GameObject({
      id: 'inflectionPoint3',
      type: GameObjectTypes.Area,
      shape: new Shape({
        type: ShapeTypes.Rectangle,
        midpoint: new Point(8 * size - size / 2, 8 * size - size / 2),
        width: size,
        height: size,
        fill: 'blue',
        alpha: 0
      })
    })

    const inflectionPoint4 = new GameObject({
      id: 'inflectionPoint4',
      type: GameObjectTypes.Area,
      shape: new Shape({
        type: ShapeTypes.Rectangle,
        midpoint: new Point(8 * size - size / 2, 4 * size - size / 2),
        width: size,
        height: size,
        fill: 'blue',
        alpha: 0
      })
    })

    const destinationArea = new GameObject({
      id: 'destinationArea',
      type: GameObjectTypes.Area,
      shape: new Shape({
        type: ShapeTypes.Rectangle,
        midpoint: new Point(3 * size - size / 2, 4 * size - size / 2),
        width: size,
        height: size,
        fill: 'red',
        alpha: 0
      })
    })

    inputArea.init(gameObjects)
    inflectionPoint1.init(gameObjects)
    inflectionPoint2.init(gameObjects)
    inflectionPoint3.init(gameObjects)
    inflectionPoint4.init(gameObjects)
    destinationArea.init(gameObjects)
  }

  loadTriggers () {
    const { gameObjects, triggers } = this
    const inputArea = gameObjects.get('inputArea')!

    const createTrigger = new Trigger({
      id: 'CreateTrigger',
      once: true,
      conditions: [
        source => source === inputArea
      ],
      actions: [
        new IntervalAction({
          type: ActionTypes.CREATE,
          source: inputArea,
          interval: 1000,
          target: {
            type: GameObjectTypes.Enemy,
            shapeOptions: {
              type: ShapeTypes.Circle,
              midpoint: { ...inputArea.shape.midpoint },
              width: 24,
              height: 24,
              radius: 12,
              fill: 'orange'
            }
          },
          callback: (gameObject: GameObject) => {
            gameObject.init(gameObjects)
          }
        })
      ]
    })

    triggers.add(createTrigger)

    triggers.add(new Trigger({
      conditions: [
        source => source.type === GameObjectTypes.Enemy,
        source => source.shape.isIntersection(inputArea.shape)
      ],

      actions: [
        new Action({
          type: ActionTypes.MOVE_TO,
          target: gameObjects.get('inflectionPoint1')!
        })
      ]
    }))

    console.log(gameObjects.get('inflectionPoint1'))
    ;([
      gameObjects.get('inflectionPoint1')!,
      gameObjects.get('inflectionPoint2')!,
      gameObjects.get('inflectionPoint3')!,
      gameObjects.get('inflectionPoint4')!
    ]).forEach((area, index, orgArr) => {
      triggers.add(new Trigger({
        conditions: [
          source => source.type === GameObjectTypes.Enemy,
          source => source.shape.isIntersection(area.shape)
        ],
  
        actions: [
          new Action({
            type: ActionTypes.MOVE_TO,
            target: index === orgArr.length - 1
              ? gameObjects.get('destinationArea')!
              : orgArr[index + 1] // nextArea
          })
        ]
      }))
    })

    triggers.add(new Trigger({
      conditions: [
        source => source.type === GameObjectTypes.Enemy,
        source => source.shape.isIntersection(gameObjects.get('destinationArea')!.shape)
      ],
      actions: [
        new Action({
          type: ActionTypes.DESTROY
        })
      ]
    }))
  }

  update () {
    const { triggers, gameObjects } = this
    triggers.forEach(trigger => {
      gameObjects.forEach(gameObject => {
        trigger.fire(gameObject)
      })
    })

    gameObjects.forEach(gameObject => gameObject.update())
    this.renderers.get('Main')!.draw(gameObjects)
  }

  run () {
    this.requestId = requestAnimationFrame(this.run.bind(this))

    this.update()
  }

  pause () {
    cancelAnimationFrame(this.requestId)
  }
}