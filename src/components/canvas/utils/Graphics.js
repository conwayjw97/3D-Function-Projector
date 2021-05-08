import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import SpriteText from 'three-spritetext';

import { evaluate } from 'mathjs'

const black = "rgb(40, 44, 52)";
const white = "rgb(255, 255, 255)";
const green = "rgb(0, 255, 0)";
const blue = "rgb(0, 0, 255)";
const red = "rgb(255, 0, 43)";

const rightBottomBack = new THREE.Vector3(100, -100, -100);
const leftBottomBack = new THREE.Vector3(-100, -100, -100);
const leftTopBack = new THREE.Vector3(-100, 100, -100);
const leftBottomFront = new THREE.Vector3(-100, -100, 100);
const rightTopBack = new THREE.Vector3(100, 100, -100);
const leftTopFront = new THREE.Vector3(-100, 100, 100);
const rightTopFront = new THREE.Vector3(100, 100, 100);
const rightBottomFront = new THREE.Vector3(100, -100, 100);

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
    this.renderLine(leftBottomBack, rightBottomBack, new THREE.LineBasicMaterial({color: green}));
    this.renderLine(leftBottomBack, leftTopBack, new THREE.LineBasicMaterial({color: red}));
    this.renderLine(leftBottomBack, leftBottomFront, new THREE.LineBasicMaterial({color: blue}));

    this.renderText("X", 102.5, -100, -100, green);
    this.renderText("Z", -100, 102.5, -100, red);
    this.renderText("Y", -100, -100, 102.5, blue);

    this.renderLine(rightBottomBack, rightTopBack, new THREE.LineBasicMaterial({color: white}));
    this.renderLine(rightTopBack, leftTopBack, new THREE.LineBasicMaterial({color: white}));
    this.renderLine(leftTopBack, leftTopFront, new THREE.LineBasicMaterial({color: white}));
    this.renderLine(leftTopFront, leftTopFront, new THREE.LineBasicMaterial({color: white}));
    this.renderLine(leftTopFront, leftBottomFront, new THREE.LineBasicMaterial({color: white}));
    this.renderLine(leftTopFront, rightTopFront, new THREE.LineBasicMaterial({color: white}));
    this.renderLine(leftBottomFront, rightBottomFront, new THREE.LineBasicMaterial({color: white}));
    this.renderLine(rightBottomFront,  rightTopFront, new THREE.LineBasicMaterial({color: white}));
    this.renderLine(rightTopFront, rightTopBack, new THREE.LineBasicMaterial({color: white}));
    this.renderLine(rightBottomFront, rightBottomBack, new THREE.LineBasicMaterial({color: white}));
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

  renderExpression(){
    const expPoints = this.evaluateExpression();
    // this.renderExpressionDots(expPoints);

    for(let x=0; x<expPoints.length-1; x++){
      for(let y=0; y<expPoints[x].length-1; y++){
        if(expPoints[x+1][y+1] != undefined){
        // this.renderExpressionSquare(expPoints, x, y);
        this.renderExpressionPlane(expPoints, x, y);}
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
    const colour = this.getColourForVector(expPoints[x][y]);
    const material = new THREE.MeshBasicMaterial( {color: colour, side: THREE.DoubleSide} );
    this.scene.add(new THREE.Mesh(planeGeometryA, material));
    this.scene.add(new THREE.Mesh(planeGeometryB, material));
  }

  getColourForVector(vector){
    let red, green, blue;
    red = green = blue = 0;
    red = Math.round(Math.abs(vector.z) * (255/100));
    blue = Math.round(Math.abs(vector.y) * (255/100));
    green = Math.round(Math.abs(vector.x) * (255/100));
    return "rgb("+red+","+green+","+blue+")";
  }

  getColourForY(y){
    let red, green, blue;
    red = green = blue = 0;
    if(y>0){
      red = Math.round(y * (255/100));
      green = Math.round(255 - red);
    }
    else{
      blue = Math.round(-y * (255/100));
      green = Math.round(255 - blue);
    }
    return "rgb("+red+","+green+","+blue+")";
  }
}
