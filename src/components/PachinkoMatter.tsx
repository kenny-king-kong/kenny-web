import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
const { Engine, Render, Runner, World, Bodies, Body, Composite, Events } = Matter;

export default function PachinkoMatter() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [score, setScore] = useState(0);
  const engineRef = useRef<Matter.Engine>();
  const renderRef = useRef<Matter.Render>();

  useEffect(() => {
    const engine = Engine.create();
    engineRef.current = engine;
    const render = Render.create({
      element: containerRef.current as HTMLElement,
      engine,
      options: { width: 600, height: 800, wireframes: false, background: "#111" }
    });
    renderRef.current = render;
    const runner = Runner.create();

    const floor = Bodies.rectangle(300, 780, 600, 20, { isStatic: true });
    World.add(engine.world, [floor]);

    Events.on(engine, "collisionStart", () => {
      setScore(s => s + 100);
    });

    Render.run(render);
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  const dropBall = () => {
    if (!engineRef.current) return;
    const ball = Bodies.circle(300, 0, 10, { restitution: 0.9 });
    World.add(engineRef.current.world, ball);
  };

  return (
    <div>
      <div ref={containerRef}></div>
      <p>Score: {score}</p>
      <button onClick={dropBall}>Drop Ball</button>
    </div>
  );
}
