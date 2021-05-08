// https://observablehq.com/@kelleyvanevert/projection-of-3d-models-using-javascript-and-html5-canvas
// https://academo.org/demos/3d-surface-plotter/
// https://www.benjoffe.com/code/tools/functions3d/examples
// https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
// https://threejsfundamentals.org/threejs/lessons/threejs-custom-geometry.html

import React, { useEffect, useRef } from "react";
import Graphics from "./utils/Graphics.js"
import "./Canvas.css";

// TODO: Convert RGB colours to Hex
function Canvas(props) {
  const canvas = useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    const graphics = new Graphics(canvas.current, width, height, "x^2", 1, [-20, 20], [-20, 20], [-20, 20]);


    // const drawer = new CanvasDrawer(ctx, width, height, (height/2)-(height/10), "1-abs(x+y)-abs(y-x)");

    // let mouseDown = false;
    //
    // canvas.current.onmousedown = (e) => {
    //   mouseDown = true;
    // }
    //
    // canvas.current.onmousemove = (e) => {
    //   if(mouseDown){
    //     // New position for canvas contents
    // 		const px = e.clientX / width;
    // 		const py = e.clientY / height;
    //     drawer.onMouseMove(px, py);
    //   }
    // }
    //
    // canvas.current.onmouseup = (e) => {
    //   mouseDown = false;
    //   drawer.onMouseUp();
    // }
    //
    // canvas.current.onwheel = (e) => {
    //   drawer.onScroll(e.deltaY);
    // }
  }, [width, height]);

  return (
    <canvas ref={canvas} width={width} height={height} className="canvas">
      <p>Your browser doesn't support canvas.</p>
    </canvas>
  );
}

export default Canvas;
