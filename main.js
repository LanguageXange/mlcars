const carCanvas = document.getElementById("carCanvas");
const networkCanvas = document.getElementById("networkCanvas");
const speedSpan = document.getElementById("speed");
const statusSpan = document.getElementById("status");
const saveBtn = document.getElementById("save-btn");
const discardBtn = document.getElementById("discard-btn");

carCanvas.width = 250;
networkCanvas.width = 600;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// sample size to help us find the best fit
const N = 150;
const cars = generateCars(N);
// initial testing car
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");

// define best car variable for updates later
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
  for (let i = 0; i < cars.length; i++) {
    // when we refresh the page the next cars array should use the best car
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    // however we don't want all of the cars to be the same
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.15); // mutate use the lerp function
    }
  }
}

// const traffic = [
//   new Car(road.getLaneCenter(0), -50, 30, 50, "DUMMY", 3),
//   new Car(road.getLaneCenter(0), 30, 30, 50, "DUMMY", 2.5),
//   new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 5.6),
//   new Car(road.getLaneCenter(2), 30, 30, 50, "DUMMY", 4.5),
//   new Car(road.getLaneCenter(2), 150, 30, 50, "DUMMY", 4),
//   new Car(road.getLaneCenter(2), 250, 30, 50, "DUMMY", 3.5),
// ];

const traffic = [
  new Car(road.getLaneCenter(1), -800, 30, 50, "KEYS"), // car I can control
  new Car(road.getLaneCenter(0), -450, 30, 50, "DUMMY", 5.5),
  new Car(road.getLaneCenter(1), -200, 30, 50, "DUMMY", 5.5),
  new Car(road.getLaneCenter(2), -400, 30, 50, "DUMMY", 5),
];

const colors = new Array(traffic.length).fill(0).map((i) => getRandomColor());

const grid = new Grid(carCanvas.width, window.innerHeight);

animate();

// button event handlers
// save the best car to local storage
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
function discard() {
  localStorage.removeItem("bestBrain");
}
saveBtn.addEventListener("click", save);
discardBtn.addEventListener("click", discard);

// generate n number of AI cars
function generateCars(n) {
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push(new Car(road.getLaneCenter(1), 50, 30, 50, "AI"));
  }
  return cars;
}

// time arg comes from the requestAnimationFrame
function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []); // pass in empty array so that dummy cars don't collide with itself
  }

  // update a bunch of AI cars
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  // find the best car
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  //car.update(road.borders, traffic);

  carCanvas.height = window.innerHeight; // resizing height & clear the carCanvas so that we can see car moving
  networkCanvas.height = window.innerHeight;
  //grid.draw(carCtx);

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.75); // to create the illusion that car is moving forward
  road.draw(carCtx);

  // draw other cars in the traffic
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, { color: colors[i] });
  }

  // draw a bunch of AI cars
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, { color: "blue", drawSensor: true }); // show sensor
  //car.draw(carCtx, { color: "green", drawSensor: true }); // my car controlled by keyboard

  carCtx.restore();

  // visualize the neuron network
  networkCtx.lineDashOffset = -time / 50; // make the line look like it's moving
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  speedSpan.textContent = bestCar.speed.toFixed(2);
  statusSpan.textContent = bestCar.damaged ? "Damaged" : "OK";

  requestAnimationFrame(animate);
}
