const canvas = document.getElementById("myCanvas");
const speedSpan = document.getElementById("speed");
const statusSpan = document.getElementById("status");

canvas.width = 250;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");

const traffic = [
  new Car(road.getLaneCenter(0), -50, 30, 50, "DUMMY", 5.5),
  new Car(road.getLaneCenter(0), 30, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 4.2),
  new Car(road.getLaneCenter(1), -20, 30, 50, "DUMMY", 4),
  new Car(road.getLaneCenter(2), 30, 30, 50, "DUMMY", 5.5),
  new Car(road.getLaneCenter(2), 150, 30, 50, "DUMMY", 5.3),
  new Car(road.getLaneCenter(2), 250, 30, 50, "DUMMY", 5.3),
];

const colors = new Array(traffic.length).fill(0).map((i) => getRandomColor());

const grid = new Grid(canvas.width, window.innerHeight);

animate();

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []); // pass in empty array so that dummy cars don't collide with itself
  }
  car.update(road.borders, traffic);

  canvas.height = window.innerHeight; // resizing height & clear the canvas so that we can see car moving

  //grid.draw(ctx);

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.75); // to create the illusion that car is moving forward
  road.draw(ctx);

  // draw other cars in the traffic
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx, { color: colors[i] });
  }
  car.draw(ctx);

  ctx.restore();

  speedSpan.textContent = car.speed.toFixed(2);
  statusSpan.textContent = car.damaged ? "Damaged" : "OK";

  requestAnimationFrame(animate);
}
