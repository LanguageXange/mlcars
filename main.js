const canvas = document.getElementById("myCanvas");
const speedDiv = document.getElementById("speed");

canvas.width = 300;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

const grid = new Grid(canvas.width, window.innerHeight);

animate();

function animate() {
  car.update(road.borders);

  canvas.height = window.innerHeight; // resizing height & clear the canvas so that we can see car moving

  //grid.draw(ctx);

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.75); // to create the illusion that car is moving forward
  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();

  speedDiv.textContent = car.speed.toFixed(3);
  requestAnimationFrame(animate);
}
