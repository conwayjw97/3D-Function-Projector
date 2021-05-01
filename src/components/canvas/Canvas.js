import React, { useEffect, useRef } from "react";
import Polygon from "./utils/Polygon.js"
import Vertex from "./utils/Vertex.js"
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

const faces = [
  new Polygon([vertices[0], vertices[1], vertices[5], vertices[4]]), // Front
  new Polygon([vertices[2], vertices[3], vertices[7], vertices[6]]), // Rear
  new Polygon([vertices[0], vertices[1], vertices[3], vertices[2]]), // Bottom
  new Polygon([vertices[4], vertices[5], vertices[7], vertices[6]]), // Top
  new Polygon([vertices[0], vertices[2], vertices[6], vertices[4]]), // Left
  new Polygon([vertices[1], vertices[3], vertices[7], vertices[5]])  // Right
]

function drawPolygon(ctx, polygon, fx, fy){
  ctx.beginPath();

  // The -1 is used to flip the y coordinate as y increases as you move down the canvas
  ctx.moveTo(fx(polygon.vertex(0)), -1 * fy(polygon.vertex(0)));
  for(let i=0; i<polygon.count(); ++i){
    ctx.lineTo(fx(polygon.vertex(i)), -1 * fy(polygon.vertex(i)));
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

    const size = width / 2;

    const fx = (vertex) => vertex.x * size / 2;
    const fy = (vertex) => vertex.y * size / 2;

    for(let i=0; i<faces.length; ++i){
      drawPolygon(ctx, faces[i], fx, fy);
    }
  }, []);

  return (
    <canvas ref={canvas} width={width} height={height} className="canvas">
      <p>Your browser doesn"t support canvas.</p>
    </canvas>
  );
}

export default Canvas;
