import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import SpriteText from 'three-spritetext';

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
    const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
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
    this.renderLine(new THREE.Vector3(-100, -100, -100), new THREE.Vector3(100, -100, -100), new THREE.LineBasicMaterial({color: green}));
    this.renderLine(new THREE.Vector3(-100, -100, -100), new THREE.Vector3(-100, 100, -100), new THREE.LineBasicMaterial({color: red}));
    this.renderLine(new THREE.Vector3(-100, -100, -100), new THREE.Vector3(-100, -100, 100), new THREE.LineBasicMaterial({color: blue}));

    this.renderText("X", 102.5, -100, -100, green);
    this.renderText("Y", -100, 102.5, -100, red);
    this.renderText("Z", -100, -100, 102.5, blue);
  }

  renderLine(startVec, endVec, material){
    const linePoints = [startVec, endVec];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const line = new THREE.Line(lineGeometry, material);
    this.scene.add(line);
  }

  renderText(string, x, y, z, color){
    const text = new SpriteText(string, 6, color);
    text.position.x = x;
    text.position.y = y;
    text.position.z = z;
    text.fontFace = "Consolas";
    this.scene.add(text);
  }

  renderExpression(expression){
    const expValues = this.evaluateExpression();

    this.renderExpressionDots(expValues);

    const expValueVertices = this.expValuesToVertices(expValues);

    for(let x=0; x<expValues.length-1; x+=1){
      for(let y=0; y<expValues[x].length-1; y+=1){
        // this.renderExpressionSquare(expValueVertices, x, y);
        // this.renderExpressionPlane(expValueVertices, x, y);
      }
    }
  }

  evaluateExpression(){
    let expValues = [];
    if(this.expression.includes("x")){
      for(let x=this.xRange[0]; x<this.xRange[1]; x+=this.detail){
        let xEval = this.expression.replaceAll("x", "("+x+")");
        let yValues = [];
        for(let y=this.yRange[0]; y<this.yRange[1]; y+=this.detail){
          let z;
          if(xEval.includes("y")){
            let yEval = xEval.replaceAll("y", "("+y+")");
            z = evaluate(yEval);
          }
          else{
            z = evaluate(xEval);
          }
          if(z>=this.zRange[0] && z<=this.zRange[1]){
            yValues.push([x, z, y]);
          }
        }
        if(yValues.length > 0){
          expValues.push(yValues);
        }
      }
    }
    return expValues;
  }

  expValuesToVertices(expValues){
    const expValueVertices = [];
    for(let x=0; x<expValues.length; x+=1){
      let expValueYVertices = [];
      for(let y=0; y<expValues[x].length; y+=1){
        expValueYVertices.push(new THREE.Vector3(expValues[x][y][0], expValues[x][y][1], expValues[x][y][2]));
      }
      expValueVertices.push(expValueYVertices);
    }
    return expValueVertices;
  }

  renderExpressionDots(expValues){
    const flattenedExpValues = expValues.flat(2);
    const material = new THREE.PointsMaterial({color: white, size: 0.25});
    const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(flattenedExpValues, 3));
    const expressionDots = new THREE.Points(geometry, material);
    this.scene.add(expressionDots);
  }

  renderExpressionSquare(expValueVertices, x, y){
    const lineMaterial = new THREE.LineBasicMaterial({color: white});
    this.renderLine(expValueVertices[x][y], expValueVertices[x+1][y], lineMaterial);
    this.renderLine(expValueVertices[x+1][y], expValueVertices[x+1][y+1], lineMaterial);
    this.renderLine(expValueVertices[x+1][y+1], expValueVertices[x][y+1], lineMaterial);
    this.renderLine(expValueVertices[x][y+1], expValueVertices[x][y], lineMaterial);
  }

  renderExpressionPlane(expValueVertices, x, y){
    let planePointsA = [expValueVertices[x][y], expValueVertices[x+1][y], expValueVertices[x+1][y+1]];
    let planeGeometryA = new THREE.BufferGeometry().setFromPoints(planePointsA);
    planeGeometryA.computeVertexNormals();

    let planePointsB = [expValueVertices[x][y], expValueVertices[x][y+1], expValueVertices[x+1][y+1]];
    let planeGeometryB = new THREE.BufferGeometry().setFromPoints(planePointsB);
    planeGeometryB.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial( {color: red, side: THREE.DoubleSide} );
    this.scene.add(new THREE.Mesh(planeGeometryA, material));
    this.scene.add(new THREE.Mesh(planeGeometryB, material));
  }
}
