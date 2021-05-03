// https://observablehq.com/@kelleyvanevert/projection-of-3d-models-using-javascript-and-html5-canvas

import React, { useEffect, useRef } from "react";
import Polygon from "./utils/Polygon.js"
import Vertex from "./utils/Vertex.js"
import Mat3 from "./utils/Mat3.js"
import "./Canvas.css";

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

function drawPolygon(ctx, polygon, matrix, fx, fy){
  ctx.beginPath();

  // Get the first vertex and apply the transformation matrix
  let vertex = polygon.vertex(0).transform(matrix);

  // Move to first vertexes coordinates on canvas using canvas positioning functions
  // The -1 is used to flip the y coordinate as y increases as you move down the canvas
  ctx.moveTo(fx(vertex), -1 * fy(vertex));
  // For each vertex, draw a line to that vertexes coordinates
  for(let i=1; i<polygon.count(); i++){
    vertex = polygon.vertex(i).transform(matrix);
    ctx.lineTo(fx(vertex), -1 * fy(vertex));
  }
  ctx.closePath();
  ctx.stroke();
}

function Canvas(props) {
  const canvas = useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    // Make 0 the centre value of the canvas context
    ctx.translate(width/2, height/2);
	  ctx.strokeStyle = "rgb(255, 255, 255)";

    const size = height / 4;    // Size of the cube
    const angle = Math.PI / 6;  // 30 degrees

    let cx = 0.000, cy = 0.000; // Positional movement
    let lx = null, ly = null;   // Last set position
    let x = 0, y = 0;           // Current position

    const render = () => {
      // Move canvas contents
      x += cx;
    	y += cy;

      // Clear canvas contents
      ctx.clearRect(-width/2, -height/2, width, height);

      // Create transformation matrix to determine how the object's coordinates
      // move to the new rotation
      const transform = Mat3.rotationX(-y * 2 * Math.PI).multiply(Mat3.rotationY(-x * 2 * Math.PI));

      // Canvas positioning functions
      const fx = (vertex) => vertex.x * size;
      const fy = (vertex) => vertex.y * size;

      for(let i=0; i<polygons.length; i++){
        drawPolygon(ctx, polygons[i], transform, fx, fy);
      }
    }

    render();

    let mouseDown = false;

    canvas.current.onmousedown = (e) => {
      mouseDown = true;
    }

    canvas.current.onmousemove = (e) => {
      if(mouseDown){
        // User mouse down coordinates
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        // Dimensions of the canvas (why the "offset"?)
    		const canvasWidth = canvas.current.offsetWidth;
    		const canvasHeight = canvas.current.offsetHeight;
        // New position for canvas contents
    		const px = mouseX / canvasWidth;
    		const py = mouseY / canvasHeight;
        // If last position was set, update movement values
    		if (lx && ly) {
    			cx = (px - lx);
    			cy = (py - ly);
    		}
        // Update last position to the position observed here
    		lx = px;
    		ly = py;
        render();
      }
    }

    canvas.current.onmouseup = (e) => {
      mouseDown = false;
      // Nullify last position so next mouse down doesn't update movement values
  		lx = null;
  		ly = null;
    }
  }, []);

  return (
    <canvas ref={canvas} width={width} height={height} className="canvas">
      <p>Your browser doesn't support canvas.</p>
    </canvas>
  );
}

export default Canvas;
