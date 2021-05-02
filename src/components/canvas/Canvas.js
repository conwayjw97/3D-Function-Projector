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
  new Polygon([vertices[1], vertices[3], vertices[7], vertices[5]])  // Right
]

const isometric = ({
  gx: (scale, c) => (vertex) => (vertex.x * c + vertex.z * c) * scale,
  gy: (scale, c) => (vertex) => (vertex.y + vertex.z * c - vertex.x * c) * scale,
});

function drawPolygon(ctx, polygon, matrix, fx, fy){
  ctx.beginPath();
  let vertex = Vertex.transform(polygon.vertex(0), matrix);

  // The -1 is used to flip the y coordinate as y increases as you move down the canvas
  ctx.moveTo(fx(vertex), -1 * fy(vertex));
  for(let i=1; i<polygon.count(); ++i){
    vertex = Vertex.transform(polygon.vertex(i), matrix);
    ctx.lineTo(fx(vertex), -1 * fy(vertex));
  }
  ctx.closePath();
  ctx.stroke();
}

function Canvas(props) {
  const canvas = useRef(null);
  const canvasLoaded = useRef(false);
  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    ctx.translate(width/2, height/2); // 0 should be in the centre
	  ctx.strokeStyle = "rgb(255, 255, 255)";

    const size = height / 2;
    const scale = size / 2;
    const angle = Math.PI / 6; // 30 degrees

    let cx = 0.001, cy = 0.001;
    let lx = null, ly = null;
    let x = 0, y = 0;

    const render = () => {
      x += cx;
    	y += cy;

      ctx.clearRect(-width/2, -height/2, width, height);
      const transform = Mat3.rotationX(-y * 2 * Math.PI).multiply(Mat3.rotationY(x * 2 * Math.PI));

      const fx = (vertex) => vertex.x * scale;
      const fy = (vertex) => vertex.y * scale;

      for(let i=0; i<polygons.length; ++i){
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
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const canvasX = canvas.current.offsetLeft;
    		const canvasY = canvas.current.offsetTop;
    		const canvasWidth = canvas.current.offsetWidth;
    		const canvasHeight = canvas.current.offsetHeight;
    		const px = (mouseX - canvasX) / canvasWidth;
    		const py = (mouseY - canvasY) / canvasHeight;
    		if (lx && ly) {
    			cx = (px - lx);
    			cy = (py - ly);
    		}
    		lx = px;
    		ly = py;
        render();
      }
    }

    canvas.current.onmouseup = (e) => {
      mouseDown = false;
  		lx = null;
  		ly = null;
    }
  }, []);

  return (
    <canvas ref={canvas} width={width} height={height} className="canvas">
      <p>Your browser doesn"t support canvas.</p>
    </canvas>
  );
}

export default Canvas;
