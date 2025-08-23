import {
  Engine, Render, Runner, World, Bodies, Body, Events
} from 'matter-js'
import { createCar, throttle, brake } from './car'

const engine = Engine.create()
const world = engine.world

const render = Render.create({
  element: document.getElementById('app')!,
  engine,
  options: {
    width: 900,
    height: 520,
    wireframes: false,
    background: '#e9eef4'
  }
})
Render.run(render)

const runner = Runner.create()
Runner.run(runner, engine)

const ground = Bodies.rectangle(450, 500, 1000, 40, { isStatic: true })
const ramp1 = Bodies.rectangle(350, 420, 220, 20, { isStatic: true, angle: -0.2 })
const ramp2 = Bodies.rectangle(650, 420, 220, 20, { isStatic: true, angle: 0.2 })
World.add(world, [ground, ramp1, ramp2])

const { composite, chassis, leftWheel, rightWheel } = createCar(200, 400)
World.add(world, composite)

const keys = new Set<string>()
window.addEventListener('keydown', e => keys.add(e.key))
window.addEventListener('keyup', e => keys.delete(e.key))

Events.on(engine, 'beforeUpdate', () => {
  const steer = 0.0008
  const drive = 0.002

  if (keys.has('ArrowUp')) {
    throttle(rightWheel, drive)
    throttle(leftWheel, drive)
  }
  if (keys.has('ArrowLeft')) {
    Body.applyForce(chassis, chassis.position, { x: -steer, y: 0 })
  }
  if (keys.has('ArrowRight')) {
    Body.applyForce(chassis, chassis.position, { x: steer, y: 0 })
  }
  if (keys.has(' ')) {
    brake(leftWheel)
    brake(rightWheel)
  }
})

;(function follow() {
  const { min, max } = composite.bounds
  const cx = (min.x + max.x) / 2
  const cy = (min.y + max.y) / 2
  const vw = render.options.width!
  const vh = render.options.height!
  Render.lookAt(render, { min: { x: cx - vw / 2, y: cy - vh / 2 }, max: { x: cx + vw / 2, y: cy + vh / 2 } })
  requestAnimationFrame(follow)
})()
