class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const largeValue = 999999;
    this.top = -largeValue;
    this.bottom = largeValue;

    const topLeft = { x: this.left, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const topRight = { x: this.right, y: this.top };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  // 0 1 2 3 ...
  getLaneCenter(laneIndex) {
    // place the car in the correct lane
    const index = Math.min(laneIndex, this.laneCount - 1); // in case we pass in the laneIndex much greater than laneCount
    const laneWidth = this.width / this.laneCount;
    return this.left + laneWidth / 2 + index * laneWidth;
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#fff";

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const value = lerp(this.left, this.right, i / this.laneCount);

      ctx.setLineDash([20, 20]);

      ctx.beginPath();
      ctx.moveTo(value, this.top);
      ctx.lineTo(value, this.bottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    for (let border of this.borders) {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    }
  }
}
