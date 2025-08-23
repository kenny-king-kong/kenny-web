import { createCarDemo } from "./example-car";

document.addEventListener("DOMContentLoaded", () => {
  const demo = createCarDemo({
    parent: document.getElementById("app")!,
    width: 800,
    height: 600,
    rendererOptions: { wireframes: false }, // optional
  });

  // Example cleanup after 30s
  // setTimeout(() => demo.stop(), 30000);
});
