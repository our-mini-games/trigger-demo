import { ShapeTypes } from '../config/definitions'
import { Point } from './Renderer'

export interface ShapeOptions {
  type: ShapeTypes
  midpoint: Point
  width: number
  height: number
  radius?: number
  fill?: string | CanvasGradient | CanvasPattern
  stroke?: string | CanvasGradient | CanvasPattern
  alpha?: number
}

export default class Shape {
  type!: ShapeTypes
  midpoint = new Point(0, 0)
  width = 0
  height = 0
  radius = 0
  alpha = 1
  fill?: string | CanvasGradient | CanvasPattern
  stroke?: string | CanvasGradient | CanvasPattern

  constructor (options: ShapeOptions) {
    Object.assign(this, options)
    if (options.radius) {
      this.width = this.height = options.radius * 2
    }
  }

  init () {}

  update () {}

  /**
   * 是否与目标图形相交
   */
  isIntersection (target: Shape) {
    return (
      Math.abs(this.midpoint.x - target.midpoint.x) <= 2 && 
      Math.abs(this.midpoint.y - target.midpoint.y) <= 2
    )
    // const {
    //   midpoint: { x: x1, y: y1 },
    //   width: w1,
    //   height: h1
    // } = this

    // const {
    //   midpoint: { x: x2, y: y2 },
    //   width: w2,
    //   height: h2
    // } = target

    // const [
    //   left1,
    //   top1,
    //   right1,
    //   bottom1
    // ] = [
    //   x1 - w1 / 2,
    //   y1 - h1 / 2,
    //   x1 + w1 / 2,
    //   y1 + h1 / 2
    // ]
    // const [
    //   left2,
    //   top2,
    //   right2,
    //   bottom2
    // ] = [
    //   x2 - w2 / 2,
    //   y2 - h2 / 2,
    //   x2 + w2 / 2,
    //   y2 + h2 / 2
    // ]

    // return !(
    //   left1 > right2 ||
    //   top1 > bottom2 ||
    //   right1 < left2 ||
    //   bottom1 < top2
    // )
  }

  setMidpoint (point: Point) {
    this.midpoint = point
  }

  render (ctx: CanvasRenderingContext2D) {
    const {
      type,
      fill,
      stroke,
      alpha
    } = this
    
    ctx.save()
    ctx.beginPath()

    ctx.globalAlpha = alpha
    if (stroke) {
      ctx.strokeStyle = stroke
    }
    if (fill) {
      ctx.fillStyle = fill
    }
    
    switch (type) {
      case ShapeTypes.Rectangle:
        this.renderRect(ctx)
        break
      case ShapeTypes.Circle:
        this.renderCircle(ctx)
        break
      default:
        break
    }

    ctx.closePath()
    ctx.restore()
  }

  renderCircle (ctx: CanvasRenderingContext2D) {
    const {
      midpoint: { x, y },
      radius,
      fill
    } = this

    ctx.arc(x, y, radius, 0, Math.PI * 2)

    if (fill) {
      ctx.fill()
    } else {
      ctx.stroke()
    }
  }

  renderRect (ctx: CanvasRenderingContext2D) {
    const {
      midpoint: { x, y },
      width,
      height,
      fill
    } = this

    ctx.translate(x, y)

    if (fill) {
      ctx.fillRect(-width / 2, -height / 2, width, height)
      return
    }
    ctx.strokeRect(-width / 2, -height / 2, width, height)
  }
}