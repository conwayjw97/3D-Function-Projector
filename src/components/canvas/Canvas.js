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
    const graphics = new Graphics(canvas.current, width, height, props.expression, props.detail, props.ranges, props.renderingFeatures);

    const updateProjection = (expression, detail, ranges, renderingFeatures) => {
      graphics.updateProjection(expression, detail, ranges, renderingFeatures);
    }

    graphicsControls.current = {updateProjection};
  }, []);

  useEffect(() => {
    graphicsControls.current.updateProjection(props.expression, props.detail, props.ranges, props.renderingFeatures);
  }, [props.detail, props.ranges, props.renderingFeatures, props.updateCount]);

  return (
    <canvas ref={canvas} width={width} height={height} className="canvas">
      <p>Your browser doesn't support canvas.</p>
    </canvas>
  );
}

export default Canvas;
