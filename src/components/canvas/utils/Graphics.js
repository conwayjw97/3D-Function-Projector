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
  constructor(canvas, width, height, expression, detail, xRange, yRange, zRange){
    this.expression = expression;
    this.detail = detail;
    this.xRange = xRange;
    this.yRange = yRange;
    this.zRange = zRange;

    this.scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height, 1, 500);
    camera.position.set(150, 100, 150);

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setSize(width, height);
    renderer.setClearColor(black);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, 0);

    this.renderAxisIndicators();
    this.renderExpression();

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
    const expPoints = this.evaluateExpression();

    this.renderExpressionDots(expPoints);

    for(let x=0; x<expPoints.length-1; x+=1){
      for(let y=0; y<expPoints[x].length-1; y+=1){
        this.renderExpressionSquare(expPoints, x, y);
        this.renderExpressionPlane(expPoints, x, y);
      }
    }
  }

  evaluateExpression(){
    const xScale = 100/this.xRange[1];
    const yScale = 100/this.yRange[1];
    const zScale = 100/this.zRange[1];
    let expPoints = [];
    if(this.expression.includes("x")){
      for(let x=this.xRange[0]; x<this.xRange[1]; x+=this.detail){
        let xEval = this.expression.replaceAll("x", "("+x+")");
        let yPoints = [];
        for(let y=this.yRange[0]; y<this.yRange[1]; y+=this.detail){
          let zEval;
          if(xEval.includes("y")){
            let yEval = xEval.replaceAll("y", "("+y+")");
            zEval = evaluate(yEval);
          }
          else{
            zEval = evaluate(xEval);
          }
          if(zEval>=this.zRange[0] && zEval<=this.zRange[1]){
            yPoints.push(new THREE.Vector3(x*xScale, zEval*zScale, y*yScale));
          }
        }
        if(yPoints.length > 0){
          expPoints.push(yPoints);
        }
      }
    }
    return expPoints;
  }

  renderExpressionDots(expPoints){
    const points = [].concat.apply([], expPoints);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.PointCloudMaterial({color: white, size: 0.25});
    const expressionPoints = new THREE.Points(geometry, material);
    this.scene.add(expressionPoints);
  }

  renderExpressionSquare(expPoints, x, y){
    const lineMaterial = new THREE.LineBasicMaterial({color: white});
    const linePoints = [expPoints[x][y], expPoints[x+1][y], expPoints[x+1][y+1], expPoints[x][y+1], expPoints[x][y]];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const line = new THREE.Line(lineGeometry, lineMaterial);

    this.scene.add(line);
  }

  renderExpressionPlane(expPoints, x, y){
    let planePointsA = [expPoints[x][y], expPoints[x+1][y], expPoints[x+1][y+1]];
    let planeGeometryA = new THREE.BufferGeometry().setFromPoints(planePointsA);
    planeGeometryA.computeVertexNormals();

    let planePointsB = [expPoints[x][y], expPoints[x][y+1], expPoints[x+1][y+1]];
    let planeGeometryB = new THREE.BufferGeometry().setFromPoints(planePointsB);
    planeGeometryB.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial( {color: red, side: THREE.DoubleSide} );
    this.scene.add(new THREE.Mesh( planeGeometryA, material ));
    this.scene.add(new THREE.Mesh( planeGeometryB, material ));
  }
}
