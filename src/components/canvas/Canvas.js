// https://observablehq.com/@kelleyvanevert/projection-of-3d-models-using-javascript-and-html5-canvas
// TODO: Create camera class to encapsulate rotational data?

import React, { useEffect, useRef } from "react";

import Polygon from "../../utils/modelling/Polygon.js"
import Vertex from "../../utils/modelling/Vertex.js"
import Mat3 from "../../utils/math/Mat3.js"
import Vec3 from "../../utils/math/Vec3.js"

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

function drawLineFromVectors(ctx, a, b) {
	ctx.beginPath();
	ctx.moveTo(a.element(0), -1 * a.element(1));
	ctx.lineTo(b.element(0), -1 * b.element(1));
	ctx.stroke();
};

function drawLineBetweenVertices(ctx, a, b, matrix, fx, fy) {
  a = a.transform(matrix);
  b = b.transform(matrix);

  ctx.beginPath();
  ctx.moveTo(fx(a), -1 * fy(a));
  ctx.lineTo(fx(b), -1 * fy(b));
  ctx.closePath();
  ctx.stroke();
};

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

function drawAxisIndicator(ctx, matrix, fx, fy){
	ctx.save();

  drawLineBetweenVertices(ctx, new Vertex(-1.0, 0, 0), new Vertex(1.0, 0, 0), matrix, fx, fy);
  drawLineBetweenVertices(ctx, new Vertex(0, -1.0, 0), new Vertex(0, 1.0, 0), matrix, fx, fy);
	drawLineBetweenVertices(ctx, new Vertex(0, 0, -1.0), new Vertex(0, 0, 1.0), matrix, fx, fy);

	ctx.restore();
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

    let size = height;          // Size of the contents
    let cx = 0.000, cy = 0.000; // Rotational movement
    let lx = null, ly = null;   // Last set rotation position
    let x = 0, y = 0;           // Current rotation position

    const render = () => {
      // Update canvas rotation
      x += cx;
    	y += cy;

      // Clear canvas contents
      ctx.clearRect(-width/2, -height/2, width, height);

      // Create transformation matrix to determine how the object's coordinates
      // move with respect to the rotation
      const transform = Mat3.rotationX(-y * 2 * Math.PI).multiply(Mat3.rotationY(-x * 2 * Math.PI));

      // Canvas positioning functions
      const fx = (vertex) => vertex.x * size;
      const fy = (vertex) => vertex.y * size;

      drawAxisIndicator(ctx, transform, fx, fy);

      // for(let i=0; i<polygons.length; i++){
      //   drawPolygon(ctx, polygons[i], transform, fx, fy);
      // }
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
        // New position for canvas contents
    		const px = mouseX / width;
    		const py = mouseY / height;
        // If last rotational position was set, update rotational movement values
    		if (lx && ly) {
    			cx = (px - lx);
    			cy = (py - ly);
    		}
        // Update last rotational position to the position observed here
    		lx = px;
    		ly = py;
        render();
      }
    }

    canvas.current.onmouseup = (e) => {
      mouseDown = false;
      // Nullify last rotational position so next mouse down doesn't update movement values
  		lx = null;
  		ly = null;
    }

    canvas.current.onwheel = (e) => {
      // if (e.deltaY < 0) {
      //   // Zoom in
      //   size *= e.deltaY * -2;
      // }
      // else {
      //   // Zoom out
      //   size /= e.deltaY * 2;
      // }
    }
  }, []);

  return (
    <canvas ref={canvas} width={width} height={height} className="canvas">
      <p>Your browser doesn't support canvas.</p>
    </canvas>
  );
}

export default Canvas;
