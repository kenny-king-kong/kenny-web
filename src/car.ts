import { Bodies, Body, Composite, Composites, Vector } from 'matter-js'

export type Car = {
  composite: Composite
  chassis: Body
  leftWheel: Body
  rightWheel: Body
}

export function createCar(x: number, y: number): Car {
  const width = 120
  const height = 30
  const wheelSize = 22

  const car = Composites.car(0, 0, width, height, wheelSize)

  const bodies = car.bodies
  const chassis = bodies.find(b => (b as any).label?.includes('Body')) ?? bodies[0]
  const [leftWheel, rightWheel] = bodies.filter(b => (b as any).circleRadius) as Body[]

  const current = Composite.bounds(car)
  const cx = (current.min.x + current.max.x) / 2
  const cy = (current.min.y + current.max.y) / 2
  Composite.translate(car, Vector.create(x - cx, y - cy))

  return { composite: car, chassis, leftWheel, rightWheel }
}

export function throttle(wheel: Body, magnitude = 0.002) {
  Body.applyForce(wheel, wheel.position, { x: magnitude, y: 0 })
}

export function brake(wheel: Body, amount = 0.9) {
  wheel.angularVelocity *= amount
}
