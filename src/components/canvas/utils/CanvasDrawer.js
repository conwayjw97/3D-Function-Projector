export default class CanvasDrawer {
  constructor(ctx, size) {
    this.ctx = ctx;
    this.size = size;

    // Make 0 the centre value of the canvas context
    this.ctx.translate(width/2, height/2);
    this.ctx.strokeStyle = "rgb(255, 255, 255)";

    this.cx = 0.000, this.cy = 0.000; // Rotational movement
    this.lx = null, this.ly = null;   // Last set rotation position
    this.x = 0, this.y = 0;           // Current rotation position

    // Canvas positioning functions
    this.fx = (vertex) => vertex.x * size;
    this.fy = (vertex) => vertex.y * size;

    this.render();
  }

  onMouseMove(px, py){
    // If last rotational position was set, update rotational movement values
    if (this.lx && this.ly) {
      this.cx = (px - this.lx);
      this.cy = (py - this.ly);
    }
    // Update last rotational position to the position observed here
    this.lx = px;
    this.ly = py;
    this.render();
  }

  onMouseUp(){
    // Nullify last rotational position so next mouse down doesn't update movement values
    this.lx = null;
    this.ly = null;
  }

  drawLineBetweenVertices(a, b, matrix) {
    a = a.transform(matrix);
    b = b.transform(matrix);

    this.ctx.beginPath();
    ctx.moveTo(fx(a), -1 * fy(a));
    ctx.lineTo(fx(b), -1 * fy(b));
    ctx.closePath();
    ctx.stroke();
  };

  drawPolygon(polygon, matrix){
    this.ctx.beginPath();

    // Get the first vertex and apply the transformation matrix
    let vertex = polygon.vertex(0).transform(matrix);

    // Move to first vertexes coordinates on canvas using canvas positioning functions
    // The -1 is used to flip the y coordinate as y increases as you move down the canvas
    this.ctx.moveTo(this.fx(vertex), -1 * this.fy(vertex));
    // For each vertex, draw a line to that vertexes coordinates
    for(let i=1; i<polygon.count(); i++){
      vertex = polygon.vertex(i).transform(matrix);
      this.ctx.lineTo(this.fx(vertex), -1 * this.fy(vertex));
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }

  render(){
    // Update canvas rotation
    this.x += this.cx;
    this.y += this.cy;

    // Clear canvas contents
    this.ctx.clearRect(-width/2, -height/2, width, height);

    // Create transformation matrix to determine how the object's coordinates
    // move with respect to the rotation
    const transform = Mat3.rotationX(-y * 2 * Math.PI).multiply(Mat3.rotationY(-x * 2 * Math.PI));

    drawAxisIndicator(transform);

    // for(let i=0; i<polygons.length; i++){
    //   drawPolygon(ctx, polygons[i], transform, fx, fy);
    // }
  }
}
