
import {
  Engine, Render, Runner,
  Bodies, Body, Composite, Composites,
  Mouse, MouseConstraint, Constraint, World, Common
} from 'matter-js';

// Helpers
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// Create engine & world
const engine = Engine.create();
engine.gravity.y = 1; // mild gravity
const world = engine.world;

// Renderer
const container = document.getElementById('scene')!;
const render = Render.create({
  element: container,
  engine,
  options: {
    width: container.clientWidth,
    height: container.clientHeight,
    background: '#ffffff',
    wireframes: false,
    pixelRatio: window.devicePixelRatio || 1,
  }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Boundaries (walls)
function makeWalls(w: number, h: number) {
  const thickness = 60;
  const walls = [
    Bodies.rectangle(w/2, h + thickness/2, w, thickness, { isStatic: true }), // floor
    Bodies.rectangle(w/2, -thickness/2, w, thickness, { isStatic: true }),    // ceiling
    Bodies.rectangle(-thickness/2, h/2, thickness, h, { isStatic: true }),    // left
    Bodies.rectangle(w + thickness/2, h/2, thickness, h, { isStatic: true })  // right
  ];
  Composite.add(world, walls);
  return walls;
}

let walls = makeWalls(render.options.width!, render.options.height!);

// Mouse drag
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  }
});
Composite.add(world, mouseConstraint);
(render as any).mouse = mouse;

// Add a floor obstacle
const platform = Bodies.rectangle(300, 300, 200, 20, {
  isStatic: true,
  chamfer: 10,
  render: { fillStyle: '#ddd' }
});
Composite.add(world, platform);

// Spawn balls util
function spawnBalls(n = 50) {
  const { width, height } = render.options;
  if (!width || !height) return;
  const balls = Composites.stack(60, 0, n, 1, 10, 0, (x, y) => {
    const r = Common.random(8, 22);
    return Bodies.circle(x, y, r, {
      restitution: 0.9,
      friction: 0.05,
      render: { fillStyle: `hsl(${Math.floor(Common.random(0,360))},70%,60%)` }
    });
  });
  Composite.add(world, balls);
}

spawnBalls(30);

// UI buttons
document.getElementById('spawn')?.addEventListener('click', () => spawnBalls(50));
document.getElementById('clear')?.addEventListener('click', () => {
  // remove all dynamic (non-static) bodies except mouse constraint body
  Composite.allBodies(world)
    .filter(b => !b.isStatic && b !== (mouseConstraint.body as any))
    .forEach(b => Composite.remove(world, b));
});

// Resize handling
function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  render.canvas.width = w * (window.devicePixelRatio || 1);
  render.canvas.height = h * (window.devicePixelRatio || 1);
  render.options.width = w;
  render.options.height = h;
  Render.lookAt(render, { min: { x: 0, y: 0 }, max: { x: w, y: h } });

  // Rebuild walls to fit new size
  Composite.remove(world, walls);
  walls = makeWalls(w, h);
}
window.addEventListener('resize', resize);
resize();

// Expose for debugging
(Object.assign(window as any, { engine, world, render }) );
