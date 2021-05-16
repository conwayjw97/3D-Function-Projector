// https://observablehq.com/@kelleyvanevert/projection-of-3d-models-using-javascript-and-html5-canvas
// https://academo.org/demos/3d-surface-plotter/
// https://www.benjoffe.com/code/tools/functions3d/examples
// https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
// https://threejsfundamentals.org/threejs/lessons/threejs-custom-geometry.html
// https://codepen.io/WebSeed/pen/ZmXxKz

import React, { useEffect, useState, useRef } from "react";
import Graphics from "./utils/Graphics.js";
import "./Canvas.css";

function Canvas(props) {
  const [loading, setLoading] = useState(true);
  const canvas = useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const graphicsControls = useRef(null);

  useEffect(() => {
    setLoading(true);
    const graphics = new Graphics(canvas.current, width, height, props.expression, props.detail, props.ranges, props.renderingMethod);
    setLoading(false);

    const updateProjection = async (expression, detail, ranges, renderingFeatures) => {
      setLoading(true);
      console.log(1);
      await graphics.updateProjection(expression, detail, ranges, renderingFeatures);
      setLoading(false);
      console.log(2);
    }

    graphicsControls.current = {updateProjection};
  }, []);

  useEffect(() => {
    graphicsControls.current.updateProjection(props.expression, props.detail, props.ranges, props.renderingMethod);
  }, [props.detail, props.renderingMethod, props.updateCount]);

  const getLoadingMessage = () => {
    console.log(loading)
    if(loading){
      return (
        <div style={{position: "absolute", top: "50%", left: "50%", pointerEvents: "none", margin: "auto", color: "rgb(255, 255, 255)", font: "60px Consolas", transform: "translate(-50%, -50%)"}}>
          Loading...
        </div>
      );
    }
  }

  return (
    <div>
      { getLoadingMessage() }
      <canvas ref={canvas} width={width} height={height} className="canvas">
        <p>Your browser doesn't support canvas.</p>
      </canvas>
    </div>
  );
}

export default Canvas;
