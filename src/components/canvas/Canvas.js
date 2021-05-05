// https://observablehq.com/@kelleyvanevert/projection-of-3d-models-using-javascript-and-html5-canvas
// TODO: Create camera class to encapsulate rotational data?

import React, { useEffect, useRef } from "react";
import CanvasDrawer from "./utils/CanvasDrawer.js"
import "./Canvas.css";

function Canvas(props) {
  const canvas = useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    const drawer = new CanvasDrawer(ctx, width, height, height);
    drawer.render();

    let mouseDown = false;

    canvas.current.onmousedown = (e) => {
      mouseDown = true;
    }

    canvas.current.onmousemove = (e) => {
      if(mouseDown){
        // New position for canvas contents
    		const px = e.clientX / width;
    		const py = e.clientY / height;
        drawer.onMouseMove(px, py);
      }
    }

    canvas.current.onmouseup = (e) => {
      mouseDown = false;
      drawer.onMouseUp();
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
