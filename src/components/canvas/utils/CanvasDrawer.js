export default class CanvasDrawer {
  constructor(ctx, size) {
    this.ctx = ctx;
    this.size = size;

    this.cx = 0.000, this.cy = 0.000; // Rotational movement
    this.lx = null, this.ly = null;   // Last set rotation position
    this.x = 0, this.y = 0;           // Current rotation position

    // Canvas positioning functions
    const fx = (vertex) => vertex.x * size;
    const fy = (vertex) => vertex.y * size;

    this.render();
  }
}
