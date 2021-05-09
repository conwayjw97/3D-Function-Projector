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
  const graphicsLoaded = useRef(false);
  let graphics;

  useEffect(() => {
    if(graphicsLoaded.current == false){
      graphics = new Graphics(canvas.current, width, height, props.expression, props.detail, [-100, 100], [-100, 100], [-100, 100]);
      graphicsLoaded.current = true;
    }
    else if (graphicsLoaded.current){
      graphics.update();
    }
  }, [props.updateCount]);

  return (
    <canvas ref={canvas} width={width} height={height} className="canvas">
      <p>Your browser doesn't support canvas.</p>
    </canvas>
  );
}

export default Canvas;
