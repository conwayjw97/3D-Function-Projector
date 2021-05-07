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
  constructor(canvas, width, height, detail, xRange, yRange){
    this.detail = detail;
    this.xRange = xRange;
    this.yRange = yRange;

    this.scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height, 1, 500);
    camera.position.set(150, 100, 150);

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setSize(width, height);
    renderer.setClearColor(black);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, 0);

    this.renderAxisIndicators();
    this.renderExpression("1-abs(x+y)-abs(y-x)");

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
    let xPoints = [];
    if(expression.includes("x")){
      for(let x=this.xRange[0]; x<this.xRange[1]; x+=this.detail){
        let xEval = expression.replaceAll("x", x);
        let yPoints = [];
        for(let y=this.yRange[0]; y<this.yRange[1]; y+=this.detail){
          let zEval;
          if(xEval.includes("y")){
            let yEval = xEval.replaceAll("y", y);
            zEval = evaluate(yEval);
          }
          else{
            zEval = evaluate(xEval);
          }
          if(zEval>=-100 && zEval<=100){
            yPoints.push(new THREE.Vector3(x, zEval, y));
          }
        }
        if(yPoints.length > 0){
          xPoints.push(yPoints);
        }
      }
    }

    // Render point planes
    for(let x=0; x<xPoints.length-1; x+=1){
      for(let y=0; y<xPoints[x].length-1; y+=1){
        const lineMaterial = new THREE.LineBasicMaterial({color: white});
        const linePoints = [xPoints[x][y], xPoints[x+1][y], xPoints[x+1][y+1], xPoints[x][y+1], xPoints[x][y]];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        const line = new THREE.Line(lineGeometry, lineMaterial);

        this.scene.add(line);

        // let planePointsA = [xPoints[x][y], xPoints[x+1][y], xPoints[x+1][y+1]];
        // let planeGeometryA = new THREE.BufferGeometry().setFromPoints(planePointsA);
        // planeGeometryA.computeVertexNormals();
        //
        // let planePointsB = [xPoints[x][y], xPoints[x][y+1], xPoints[x+1][y+1]];
        // let planeGeometryB = new THREE.BufferGeometry().setFromPoints(planePointsB);
        // planeGeometryB.computeVertexNormals();
        //
        // const material = new THREE.MeshBasicMaterial( {color: red, side: THREE.DoubleSide} );
        // this.scene.add(new THREE.Mesh( planeGeometryA, material ));
        // this.scene.add(new THREE.Mesh( planeGeometryB, material ));
      }
    }

    // Render points
    // const points = [].concat.apply([], xPoints);
    // const geometry = new THREE.BufferGeometry().setFromPoints(points);
    // const material = new THREE.PointCloudMaterial({color: white, size: 0.25});
    // const expressionPoints = new THREE.Points(geometry, material);
    // this.scene.add(expressionPoints);
  }
}
