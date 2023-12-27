// to visuazlie the position of the car
class Grid {
  constructor(width, height, gap = 50) {
    this.width = width;
    this.height = height;
    this.gap = gap;
  }

  draw(ctx) {
    ctx.beginPath();

    for (let i = this.gap; i < this.height; i += this.gap) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.height);

      ctx.moveTo(0, i);
      ctx.lineTo(this.width, i);
    }
    ctx.strokeStyle = "#999";
    ctx.stroke();
  }
}
