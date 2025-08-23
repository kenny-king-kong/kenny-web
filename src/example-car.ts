// example-car.ts — TypeScript port of the provided JS demo
// Requires: matter-js (and its types, which are bundled). Install with: npm i matter-js
// Build target: DOM (this file manipulates document.body)

import {
  Engine,
  Render,
  Runner,
  Composite,
  Composites,
  MouseConstraint,
  Mouse,
  Bodies,
  Body,
  Constraint,
  IRendererOptions
} from "matter-js";

// Public API returned by createCarDemo()
export interface CarDemoHandle {
  engine: Engine;
  runner: Runner;
  render: Render;
  canvas: HTMLCanvasElement;
  stop: () => void;
}

// Utility: create the car composite (ported from Example.car.car)
export function createCar(
  xx: number,
  yy: number,
  width: number,
  height: number,
  wheelSize: number
): Composite {
  const group = Body.nextGroup(true);
  const wheelBase = 20;
  const wheelAOffset = -width * 0.5 + wheelBase;
  const wheelBOffset = width * 0.5 - wheelBase;
  const wheelYOffset = 0;

  const car = Composite.create({ label: "Car" });
  const body = Bodies.rectangle(xx, yy, width, height, {
    collisionFilter: { group },
    chamfer: { radius: height * 0.5 },
    density: 0.0002,
  });

  const wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, {
    collisionFilter: { group },
    friction: 0.8,
  });

  const wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, {
    collisionFilter: { group },
    friction: 0.8,
  });

  const axelA = Constraint.create({
    bodyB: body,
    pointB: { x: wheelAOffset, y: wheelYOffset },
    bodyA: wheelA,
    stiffness: 1,
    length: 0,
  });

  const axelB = Constraint.create({
    bodyB: body,
    pointB: { x: wheelBOffset, y: wheelYOffset },
    bodyA: wheelB,
    stiffness: 1,
    length: 0,
  });

  Composite.add(car, [body, wheelA, wheelB, axelA, axelB]);
  return car;
}

export interface CarDemoOptions {
  width?: number;
  height?: number;
  parent?: HTMLElement; // defaults to document.body
  rendererOptions?: Partial<IRendererOptions>;
}

// Main entry: creates the world, renders, adds cars and ground, returns a handle
export function createCarDemo(opts: CarDemoOptions = {}): CarDemoHandle {
  const width = opts.width ?? 800;
  const height = opts.height ?? 600;
  const parent = opts.parent ?? document.body;

  // engine & world
  const engine = Engine.create();
  const { world } = engine;

  // renderer
  const render = Render.create({
    element: parent,
    engine,
    options: {
      width,
      height,
      showAngleIndicator: true,
      showCollisions: true,
      ...(opts.rendererOptions ?? {}),
    },
  });

  Render.run(render);

  // runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // walls
  Composite.add(world, [
    Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 50, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 50, height, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 50, height, { isStatic: true }),
  ]);

  // cars
  let scale = 0.9;
  Composite.add(
    world,
    createCar(150, 100, 150 * scale, 30 * scale, 30 * scale)
  );

  scale = 0.8;
  Composite.add(
    world,
    createCar(350, 300, 150 * scale, 30 * scale, 30 * scale)
  );

  // ramps / platforms
  Composite.add(world, [
    Bodies.rectangle(200, 150, 400, 20, {
      isStatic: true,
      angle: Math.PI * 0.06,
      render: { fillStyle: "#060a19" },
    }),
    Bodies.rectangle(500, 350, 650, 20, {
      isStatic: true,
      angle: -Math.PI * 0.06,
      render: { fillStyle: "#060a19" },
    }),
    Bodies.rectangle(300, 560, 600, 20, {
      isStatic: true,
      angle: Math.PI * 0.04,
      render: { fillStyle: "#060a19" },
    }),
  ]);

  // mouse control
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });

  Composite.add(world, mouseConstraint);
  (render as Render & { mouse?: Mouse }).mouse = mouse;

  // fit viewport
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: width, y: height },
  });

  return {
    engine,
    runner,
    render,
    canvas: render.canvas,
    stop: () => {
      Render.stop(render);
      Runner.stop(runner);
    },
  };
}

// Optional default export for convenience
export default { createCar, createCarDemo };
