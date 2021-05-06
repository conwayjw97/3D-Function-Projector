// https://observablehq.com/@kelleyvanevert/projection-of-3d-models-using-javascript-and-html5-canvas
// https://academo.org/demos/3d-surface-plotter/
// https://www.benjoffe.com/code/tools/functions3d/examples
// https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene

import React, { useEffect, useRef } from "react";
import CanvasDrawer from "./utils/CanvasDrawer.js"
import * as THREE from "three";
import "./Canvas.css";

function Canvas(props) {
  const canvas = useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer( { canvas: canvas.current } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    const animate = () => {
    	requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    	renderer.render(scene, camera);
    }

    animate();


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
