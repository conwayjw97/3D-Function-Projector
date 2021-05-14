// https://observablehq.com/@kelleyvanevert/projection-of-3d-models-using-javascript-and-html5-canvas
// https://academo.org/demos/3d-surface-plotter/
// https://www.benjoffe.com/code/tools/functions3d/examples
// https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
// https://threejsfundamentals.org/threejs/lessons/threejs-custom-geometry.html
// https://codepen.io/WebSeed/pen/ZmXxKz

import React, { useEffect, useRef } from "react";
import Graphics from "./utils/Graphics.js"
import "./Canvas.css";

function Canvas(props) {
  const canvas = useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const graphicsControls = useRef(null);

  useEffect(() => {
    const graphics = new Graphics(canvas.current, width, height, props.expression, props.detail, props.ranges, props.renderingMethod);

    const updateProjection = (expression, detail, ranges, renderingFeatures) => {
      graphics.updateProjection(expression, detail, ranges, renderingFeatures);
    }

    graphicsControls.current = {updateProjection};
  }, []);

  useEffect(() => {
    graphicsControls.current.updateProjection(props.expression, props.detail, props.ranges, props.renderingMethod);
  }, [props.detail, props.renderingMethod, props.updateCount]);

  return (
    <div>
      <div style={{position: "absolute", top: "0", left: "0", width:"100%", height:"100%", pointerEvents: "none", margin: "auto"}}>
          Loading...
      </div>
      <canvas ref={canvas} width={width} height={height} className="canvas">
        <p>Your browser doesn't support canvas.</p>
      </canvas>
    </div>
  );
}

export default Canvas;
