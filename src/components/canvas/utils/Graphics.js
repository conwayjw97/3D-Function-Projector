import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { evaluate } from 'mathjs'

const black = "rgb(40, 44, 52)";
const white = "rgb(255, 255, 255)";
const green = "rgb(36, 173, 48)";
const blue = "rgb(43, 125, 207)";
const red = "rgb(207, 43, 43)";

export default class Graphics{
  constructor(canvas, width, height){
    this.scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height, 1, 500);
    camera.position.set(150, 100, 150);

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setSize(width, height);
    renderer.setClearColor(black);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, 0);

    this.renderAxisIndicators();
    this.renderExpression("x^2");

    const animate = () => {
    	requestAnimationFrame(animate);
    	renderer.render(this.scene, camera);
      controls.update();
    }

    animate();
  }

  renderAxisIndicators(){
    const xAxisMaterial = new THREE.LineBasicMaterial({color: green});
    const xAxisPoints = [new THREE.Vector3(-100, -100, -100), new THREE.Vector3(100, -100, -100)];
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints(xAxisPoints);
    const xAxisLine = new THREE.Line(xAxisGeometry, xAxisMaterial);

    const yAxisMaterial = new THREE.LineBasicMaterial({color: red});
    const yAxisPoints = [new THREE.Vector3(-100, -100, -100), new THREE.Vector3(-100, 100, -100)];
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints(yAxisPoints);
    const yAxisLine = new THREE.Line(yAxisGeometry, yAxisMaterial);

    const zAxisMaterial = new THREE.LineBasicMaterial({color: blue});
    const zAxisPoints = [new THREE.Vector3(-100, -100, -100), new THREE.Vector3(-100, -100, 100)];
    const zAxisGeometry = new THREE.BufferGeometry().setFromPoints(zAxisPoints);
    const zAxisLine = new THREE.Line(zAxisGeometry, zAxisMaterial);

    this.scene.add(xAxisLine);
    this.scene.add(yAxisLine);
    this.scene.add(zAxisLine);
  }

  renderExpression(expression){
    // Evaluate expression points
    let points = [];
    if(expression.includes("x")){
      for(let x=-100; x<100; x+=1){
        let xEval = expression.replaceAll("x", x);
        for(let y=-100; y<100; y+=1){
          let zEval;
          if(xEval.includes("y")){
            let yEval = xEval.replaceAll("y", y);
            zEval = evaluate(yEval);
          }
          else{
            zEval = evaluate(xEval);
          }
          if(zEval>=-100 && zEval<=100){
            points.push(new THREE.Vector3(x, zEval, y));
          }
        }
      }
    }

    // Render point planes
    for(let x=0; x<points.length-201; x+=1){
      const lineMaterial = new THREE.LineBasicMaterial({color: white});
      const linePoints = [points[x], points[x+1], points[x+200], points[x+201]];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
      const line = new THREE.Line(lineGeometry, lineMaterial);

      this.scene.add(line);

      // let planePointsA = [points[x], points[x+1], points[x+200]];
      // let planeGeometryA = new THREE.BufferGeometry().setFromPoints(planePointsA);
      // planeGeometryA.computeVertexNormals();
      //
      // let planePointsB = [points[x+1], points[x+200], points[x+201]];
      // let planeGeometryB = new THREE.BufferGeometry().setFromPoints(planePointsB);
      // planeGeometryB.computeVertexNormals();
      //
      // const material = new THREE.MeshBasicMaterial( {color: red, side: THREE.DoubleSide} );
      // this.scene.add(new THREE.Mesh( planeGeometryA, material ));
      // this.scene.add(new THREE.Mesh( planeGeometryB, material ));
    }

    // Render points
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.PointCloudMaterial({color: white, size: 0.25});
    const expressionPoints = new THREE.Points(geometry, material);
    this.scene.add(expressionPoints);
  }
}
