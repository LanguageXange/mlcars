const canvas = document.getElementById("myCanvas");
const speedDiv = document.getElementById("speed");

canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(100, 500, 30, 50);

const grid = new Grid(canvas.width, window.innerHeight);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight; // resizing height & clear the canvas so that we can see car moving

  grid.draw(ctx);
  road.draw(ctx);
  car.draw(ctx);

  speedDiv.textContent = car.speed.toFixed(3);

  requestAnimationFrame(animate);
}
