import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import SpriteText from 'three-spritetext';

import { evaluate } from 'mathjs'

const black = "rgb(40, 44, 52)";
const white = "rgb(255, 255, 255)";
const green = "rgb(0, 255, 0)";
const blue = "rgb(0, 0, 255)";
const red = "rgb(255, 0, 43)";

const rightTopBack = new THREE.Vector3(100, 100, -100);
const rightBottomBack = new THREE.Vector3(100, -100, -100);
const rightTopFront = new THREE.Vector3(100, 100, 100);
const rightBottomFront = new THREE.Vector3(100, -100, 100);
const leftTopBack = new THREE.Vector3(-100, 100, -100);
const leftBottomBack = new THREE.Vector3(-100, -100, -100);
const leftTopFront = new THREE.Vector3(-100, 100, 100);
const leftBottomFront = new THREE.Vector3(-100, -100, 100);

export default class Graphics{
  constructor(canvas, width, height, expression, detail, xRange, yRange, zRange){
    this.expression = expression;
    this.detail = detail;
    this.xRange = xRange;
    this.yRange = yRange;
    this.zRange = zRange;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    this.camera.position.set(150, 100, 150);

    this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(black);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(0, 0, 0);

    this.renderAxisIndicators();
    this.renderExpression();

    const animate = () => {
    	requestAnimationFrame(animate);
    	this.renderer.render(this.scene, this.camera);
      this.controls.update();
    }

    animate();
  }

  updateExpression(expression){
    this.expression = expression;
    this.scene.remove(this.expressionGroup);
    this.renderExpression();
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
    this.expressionGroup = new THREE.Group();
    const expPoints = this.evaluateExpression();

    this.expressionGroup = this.createExpressionDots(this.expressionGroup, expPoints);
    for(let x=0; x<expPoints.length; x++){
      for(let y=0; y<expPoints[x].length; y++){
        // this.renderText(x + ":" + y, expPoints[x][y].x, expPoints[x][y].y, expPoints[x][y].z, white);
        this.expressionGroup = this.createExpressionSquare(this.expressionGroup, expPoints, x, y);
        this.expressionGroup = this.createExpressionPlane(this.expressionGroup, expPoints, x, y);
      }
    }

    this.scene.add(this.expressionGroup);
  }

  evaluateExpression(){
    let expPoints = [];
    if(this.expression.includes("x") || this.expression.includes("y")){
      for(let x=this.xRange[0]; x<=this.xRange[1]; x+=this.detail){
        let xEval = this.expression.replaceAll("x", "("+x+")");
        let yPoints = [];
        for(let y=this.yRange[0]; y<=this.yRange[1]; y+=this.detail){
          let zEval;
          if(xEval.includes("y")){
            let yEval = xEval.replaceAll("y", "("+y+")");
            zEval = evaluate(yEval);
          }
          else{
            zEval = evaluate(xEval);
          }
          if(zEval>=this.zRange[0] && zEval<=this.zRange[1]){
            yPoints.push(new THREE.Vector3(x, zEval, y));
          }
        }
        if(yPoints.length > 0){
          expPoints.push(yPoints);
        }
      }
    }
    return expPoints;
  }

  createExpressionDots(group, expPoints){
    const points = [].concat.apply([], expPoints);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.PointCloudMaterial({color: white, size: 0.25});
    const expressionPoints = new THREE.Points(geometry, material);
    group.add(expressionPoints);
    return group;
  }

  createExpressionSquare(group, expPoints, x, y){
    const isValidPoint = expPoints[x+1] !== undefined;

    if(isValidPoint){
      const material = new THREE.LineBasicMaterial({color: white});

      const isWholeSquare = expPoints[x+1][y] !== undefined && expPoints[x+1][y] !== undefined && expPoints[x+1][y+1] !== undefined && expPoints[x][y+1] !== undefined;
      const isClosingTriangle = expPoints[x+1][y] !== undefined && expPoints[x+1][y+1] !== undefined;
      const isClosingLine = expPoints[x][y+1] !== undefined && expPoints[x+1][y] !== undefined;

      let points = null;
      if(isWholeSquare){
        points = [expPoints[x][y], expPoints[x+1][y], expPoints[x+1][y+1], expPoints[x][y+1], expPoints[x][y]];
      }
      else if(isClosingTriangle){
        points = [expPoints[x][y], expPoints[x+1][y], expPoints[x+1][y+1], expPoints[x][y]];
      }
      else if(isClosingLine){
        points = [expPoints[x][y], expPoints[x][y+1], expPoints[x+1][y]];
      }

      if(points !== null){
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        group.add(line);
      }
    }

    return group;
  }

  createExpressionPlane(group, expPoints, x, y){
    const isValidPoint = expPoints[x+1] !== undefined;

    if(isValidPoint){
      const colour = this.getColourForVector(expPoints[x][y]);
      const material = new THREE.MeshBasicMaterial({color: colour, side: THREE.DoubleSide});

      const firstTriangleValid = expPoints[x+1][y] !== undefined && expPoints[x+1][y+1] !== undefined;
      const secondTriangleValid = expPoints[x][y+1] !== undefined && expPoints[x+1][y+1] !== undefined;
      const downardsTriangleValid = expPoints[x][y+1] !== undefined && expPoints[x+1][y] !== undefined;

      let downardsTriangleNeeded = true;
      if(firstTriangleValid){
        downardsTriangleNeeded = false;
        const planePointsA = [expPoints[x][y], expPoints[x+1][y], expPoints[x+1][y+1]];
        const planeGeometryA = new THREE.BufferGeometry().setFromPoints(planePointsA);
        group.add(new THREE.Mesh(planeGeometryA, material));
      }
      if(secondTriangleValid){
        downardsTriangleNeeded = false;
        const planePointsB = [expPoints[x][y], expPoints[x][y+1], expPoints[x+1][y+1]];
        const planeGeometryB = new THREE.BufferGeometry().setFromPoints(planePointsB);
        group.add(new THREE.Mesh(planeGeometryB, material));
      }
      if(downardsTriangleNeeded && downardsTriangleValid){
        const planePoints = [expPoints[x][y], expPoints[x][y+1], expPoints[x+1][y]];
        const planeGeometry = new THREE.BufferGeometry().setFromPoints(planePoints);
        group.add(new THREE.Mesh(planeGeometry, material));
      }
    }

    return group;
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
