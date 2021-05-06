import Polygon from "../../../utils/modelling/Polygon.js"
import Vertex from "../../../utils/modelling/Vertex.js"
import Mat3 from "../../../utils/math/Mat3.js"
import Vec3 from "../../../utils/math/Vec3.js"
import {
  evaluate
} from 'mathjs'

const white = "rgb(255, 255, 255)";
const green = "rgb(36, 173, 48)";
const blue = "rgb(43, 125, 207)";
const red = "rgb(207, 43, 43)";

const vertices = [
  new Vertex(-1.0, -1.0, -1.0), // Front-Bottom-Left
  new Vertex( 1.0, -1.0, -1.0), // Front-Bottom-Right
  new Vertex(-1.0, -1.0,  1.0), // Rear-Bottom-Left
  new Vertex( 1.0, -1.0,  1.0), // Rear-Bottom-Right
  new Vertex(-1.0,  1.0, -1.0), // Front-Top-Left
  new Vertex( 1.0,  1.0, -1.0), // Front-Top-Right
  new Vertex(-1.0,  1.0,  1.0), // Rear-Top-Left
  new Vertex( 1.0,  1.0,  1.0)  // Rear-Top-Right
]

const polygons = [
  new Polygon([vertices[0], vertices[1], vertices[5], vertices[4]]), // Front
  new Polygon([vertices[2], vertices[3], vertices[7], vertices[6]]), // Rear
  new Polygon([vertices[0], vertices[1], vertices[3], vertices[2]]), // Bottom
  new Polygon([vertices[4], vertices[5], vertices[7], vertices[6]]), // Top
  new Polygon([vertices[0], vertices[2], vertices[6], vertices[4]]), // Left
  new Polygon([vertices[1], vertices[3], vertices[7], vertices[5]]), // Right
]

export default class CanvasDrawer{
  constructor(ctx, width, height, size, expression){
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.size = size;
    this.expression = expression;

    // Make 0 the centre value of the canvas context
    this.ctx.translate(width/2, height/2);
    this.ctx.strokeStyle = "rgb(255, 255, 255)";

    // Rotational movement
    this.cx = 0.000
    this.cy = 0.000;
    // Last set rotation position
    this.lx = null
    this.ly = null;
    // Current rotation position
    this.x = 0
    this.y = 0;

    this.evaluateExpression();
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

  onScroll(delta){
    this.size -= delta/2;
    this.render();
  }

  drawVertex(vertex, matrix){
    vertex = vertex.transform(matrix);

    this.ctx.fillStyle = white;
    this.ctx.beginPath();
    this.ctx.arc(this.fx(vertex), -1 * this.fy(vertex), 1, 0, 2 * Math.PI);
    this.ctx.fill();
  };

  drawLineBetweenVertices(a, b, matrix){
    a = a.transform(matrix);
    b = b.transform(matrix);

    this.ctx.beginPath();
    this.ctx.moveTo(this.fx(a), -1 * this.fy(a));
    this.ctx.lineTo(this.fx(b), -1 * this.fy(b));
    this.ctx.closePath();
    this.ctx.stroke();
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

  drawAxisIndicator(matrix){
  	this.ctx.save();

    this.ctx.strokeStyle = red;
    this.drawLineBetweenVertices(new Vertex(-1.0, -1.0, 1.0), new Vertex(1.0, -1.0, 1.0), matrix);
    this.ctx.strokeStyle = green;
    this.drawLineBetweenVertices(new Vertex(-1.0, -1.0, 1.0), new Vertex(-1.0, 1.0, 1.0), matrix);
    this.ctx.strokeStyle = blue;
  	this.drawLineBetweenVertices(new Vertex(-1.0, -1.0, -1.0), new Vertex(-1.0, -1.0, 1.0), matrix);

  	this.ctx.restore();
  }

  drawExpression(matrix){
    for (let vertex of this.expressionVertexes) {
      this.drawVertex(vertex, matrix);
    }
  }

  evaluateExpression(){
    this.expressionVertexes = [];
    if(this.expression.includes("x")){
      for(let x=-1.0; x<1.0; x+=0.025){
        let xEval = this.expression.replaceAll("x", x);
        if(xEval.includes("y")){
          for(let y=-1.0; y<1.0; y+=0.025){
            let yEval = xEval.replaceAll("y", y);
            this.expressionVertexes.push(new Vertex(x, evaluate(yEval), y));
          }
        }
      }
    }
  }

  render(){
    // Clear canvas contents
    this.ctx.clearRect(-this.width/2, -this.height/2, this.width, this.height);

    // Canvas positioning functions
    this.fx = (vertex) => vertex.x * this.size;
    this.fy = (vertex) => vertex.y * this.size;

    // Update canvas rotation
    this.x += this.cx;
    this.y += this.cy;

    // Create transformation matrix to determine how the object's coordinates
    // move with respect to the rotation
    const transform = Mat3.rotationX(-this.y * 2 * Math.PI).multiply(Mat3.rotationY(-this.x * 2 * Math.PI));

    this.drawAxisIndicator(transform);
    this.drawExpression(transform);
  }
}
