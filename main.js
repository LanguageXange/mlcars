const canvas = document.getElementById("myCanvas");
canvas.width = 200;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
const car = new Car(100, 100, 30, 50);

animate();

function animate() {
  car.update();
  car.draw(ctx);
  requestAnimationFrame(animate);
}
