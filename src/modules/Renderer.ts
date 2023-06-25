import GameObject from './GameObject'

export default class Renderer {
  canvas = document.createElement('canvas')
  ctx = this.canvas.getContext('2d')!
  width = 0
  height = 0

  constructor (width = 800, height = 600) {
    this.width = width
    this.height = height

    this.canvas.width = width
    this.canvas.height = height
  }

  draw (gameObjects: Map<string, GameObject>) {
    this.clear()

    gameObjects.forEach(gameObject => gameObject.shape.render(this.ctx))
  }

  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  mount (el: HTMLElement) {
    el.appendChild(this.canvas)
  }

  unmount (el: HTMLElement) {
    el.removeChild(this.canvas)
  }
}

export class Point {
  x: number
  y: number

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }
}
