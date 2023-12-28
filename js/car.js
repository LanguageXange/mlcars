class Car {
  constructor(x, y, width, height, controlType = "DUMMY", maxSpeed = 6) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // more realistic forward backward car movement
    this.speed = 0;
    this.acceleration = 0.02;
    this.maxSpeed = maxSpeed;
    this.friction = 0.008;
    // angle provides more realistic left and right movement
    this.angle = 0;

    // car damaged ( use car corner to detect)
    this.damaged = false;

    // self driving car
    this.useBrain = controlType === "AI";

    // sensor
    if (controlType !== "DUMMY") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]); // we can have as many layers as we want
    }

    // controls
    this.controls = new Controls(controlType);
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
    let frictionFactor = this.controls.stop ? 6 : 1;

    if (this.speed > 0) {
      this.speed -= this.friction * frictionFactor;
    }
    if (this.speed < 0) {
      this.speed += this.friction * frictionFactor;
    }
    // car is constantly moving if the speed is close to zero because of the friction - need to set speed to zero
    if (Math.abs(this.speed) < this.friction) {
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

  update(roadBorders, traffic) {
    // only move the car if it's not damaged
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon(); // array of corner points of the car [{x,y}, {x,y},...]
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map((r) =>
        r === null ? 0 : 1 - r.offset
      ); // we want neuron to receive lower value when obstacle is still far away

      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      // console.log(outputs); // array of zero or one currently values are random
      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.backward = outputs[3];
      }
    }
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      // detect if the car polygon intersects with road border line segment
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    // traffic is simply an array of cars
    for (let i = 0; i < traffic.length; i++) {
      // detect if the car polygon intersects with another car polygon
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  // we need a way to know the position of the car corner to detect collision see createPolygonMath.png
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    // remember that this.angle will be negative value when we do right turn
    points.push({
      // top right
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });

    points.push({
      // top left
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });

    points.push({
      // bottom left
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });

    points.push({
      // bottom right
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  draw(ctx, config = { color: "rgba(0,0,50,0.5)", drawSensor: false }) {
    const { color, drawSensor } = config;
    // draw rectangle car ( initial approach )
    // ctx.beginPath();
    // ctx.save();
    // ctx.translate(this.x, this.y); // so the x,y is centered in the car
    // ctx.rotate(-this.angle);
    // ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    // ctx.fillStyle = "rgba(0,0,0,0.7)";
    // ctx.fill();
    // ctx.restore();

    if (this.damaged) {
      ctx.fillStyle = "rgba(250,0,0,0.8)";
    } else {
      ctx.fillStyle = color;
    }
    // draw polygon ( using car corner point)
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }

    ctx.closePath();

    ctx.fill();

    // we only want to draw sensor for the best car
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }
  }
}
