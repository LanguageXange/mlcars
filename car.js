class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // more realistic forward backward car movement
    this.speed = 0;
    this.acceleration = 0.02;
    this.maxSpeed = 6;
    this.friction = 0.008;
    // more realistic left and right movement
    this.angle = 0;

    // controls
    this.controls = new Controls();
  }
  #move() {
    let factor = this.controls.boost ? 4 : 1;
    if (this.controls.forward) {
      this.speed += this.acceleration * factor;
    }

    if (this.controls.backward) {
      this.speed -= this.acceleration * factor;
    }

    // don't go over the maxspeed for up movement
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    // negative speed simply indicates direction
    if (this.speed < -this.maxSpeed) {
      this.speed = -this.maxSpeed;
    }

    // friction
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    // car is constantly moving if the speed is close to zero because of the friction - need to set speed to zero
    if (Math.abs(this.speed) < this.friction || this.controls.stop) {
      this.speed = 0;
    }

    // left and right
    // when moving backward, the rotation needs to be flipped
    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    // update car position considering the angle
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  update() {
    this.#move();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(this.x, this.y); // so the x,y is centered in the car
    ctx.rotate(-this.angle);
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fill();

    ctx.restore();
  }
}
