class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 6; // ray casting
    this.rayLength = 150;
    this.raySpread = Math.PI / 3; // how spread out the sensor should be

    this.rays = []; // [[start,end]] length = rayCount

    // detecting how far the road border is
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.#castRays();

    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }

  // return the closest touch {x,y,offset}
  #getReading(ray, roadBorders, traffic) {
    let touches = [];

    // getIntersection returns an object with x, y, offset (meaning how far the obstable is from the center of the car)
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0], // ray start,
        ray[1], // ray end
        roadBorders[i][0], // road border top point
        roadBorders[i][1] // road border bottom point
      );
      if (touch) {
        touches.push(touch);
      }
    }

    // traffic is an array of car polygon
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );

        if (value) {
          touches.push(value);
        }
      }
    }

    if (touches.length === 0) {
      return null;
    } else {
      const offsets = touches.map((t) => t.offset);
      // return the minimum offest aka the nearest one
      const minOffset = Math.min(...offsets);
      return touches.find((touch) => touch.offset === minOffset);
    }
  }

  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const lerpT = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1); // minuse one here cause `i` never reaches rayCount
      const rayAngle =
        lerp(this.raySpread / 2, -this.raySpread / 2, lerpT) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength, // we can change the direction of rays if we use addition here
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      // draw readings if there is a touch
      let rayEndPoint = this.rays[i][1];
      if (this.readings[i]) {
        rayEndPoint = this.readings[i]; // update end point to the touch point
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(rayEndPoint.x, rayEndPoint.y);
      ctx.stroke();

      // see where the original line would be
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(rayEndPoint.x, rayEndPoint.y);
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.stroke();
    }
  }
}
