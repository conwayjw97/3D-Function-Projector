import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import SpriteText from 'three-spritetext';

import { evaluate } from 'mathjs'

const black = "rgb(40, 44, 52)";
const white = "rgb(255, 255, 255)";
const green = "rgb(25, 207, 41)"
const blue = "rgb(35, 151, 235)";
const red = "rgb(199, 24, 24)";

const whiteMaterial = new THREE.LineBasicMaterial({color: white});
const greenMaterial = new THREE.LineBasicMaterial({color: green});
const blueMaterial = new THREE.LineBasicMaterial({color: blue});
const redMaterial  = new THREE.LineBasicMaterial({color: red});

const rightBottomBack = new THREE.Vector3(100, -100, -100);
const leftTopBack = new THREE.Vector3(-100, 100, -100);
const leftBottomBack = new THREE.Vector3(-100, -100, -100);
const leftBottomFront = new THREE.Vector3(-100, -100, 100);

export default class Graphics{
  constructor(canvas, width, height, expression, detail, ranges, renderingMethod){
    this.expression = expression;
    this.detail = detail;
    this.xRange = [parseInt(ranges[0][0]), parseInt(ranges[0][1])];
    this.yRange = [parseInt(ranges[1][0]), parseInt(ranges[1][1])];
    this.zRange = [parseInt(ranges[2][0]), parseInt(ranges[2][1])];
    this.renderingMethod = renderingMethod;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    this.camera.position.set(250, 150, 250);

    this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(black);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(0, 25, 0);

    this.renderAxes();
    this.renderExpression();

    const animate = () => {
    	requestAnimationFrame(animate);
    	this.renderer.render(this.scene, this.camera);
      this.controls.update();
    }

    animate();
  }

  updateProjection(expression, detail, ranges, renderingMethod){
    if(this.expression !== expression || this.detail !== detail || this.ranges !== ranges || this.renderingMethod !== renderingMethod){
      this.expression = expression;
      this.detail = detail;
      this.xRange = [parseInt(ranges[0][0]), parseInt(ranges[0][1])];
      this.yRange = [parseInt(ranges[1][0]), parseInt(ranges[1][1])];
      this.zRange = [parseInt(ranges[2][0]), parseInt(ranges[2][1])];
      this.renderingMethod = renderingMethod;
      this.scene.remove(this.expressionGroup);
      this.renderExpression();
    }
  }

  renderAxes(){
    this.scene.add(this.createLine(leftBottomBack, rightBottomBack, greenMaterial));
    this.scene.add(this.createLine(leftBottomBack, leftBottomFront, blueMaterial));
    this.scene.add(this.createLine(leftBottomBack, leftTopBack, redMaterial));

    this.scene.add(this.createText("X", 6, 102.5, -100, -100, green));
    this.scene.add(this.createText("Y", 6, -100, -100, 102.5, blue));
    this.scene.add(this.createText("Z", 6, -100, 102.5, -100, red));
  }

  renderExpression(){
    const expPoints = this.evaluateExpression();

    this.expressionGroup = new THREE.Group();

    const startVec = new THREE.Vector3(0, 0, 0);
    const endVec = new THREE.Vector3(0, 0, 0);
    for(let i=-80; i<100; i+=20){
      this.expressionGroup.add(this.createText(this.rangeScale(i, -100, 100, this.xRange[0], this.xRange[1]), 4, i, -100, -110, green));
      this.expressionGroup.add(this.createText(this.rangeScale(i, -100, 100, this.yRange[0], this.yRange[1]), 4, -110, -100, i, blue));
      this.expressionGroup.add(this.createText(this.rangeScale(i, -100, 100, this.zRange[0], this.zRange[1]), 4, -110, i, -110, red));

      this.expressionGroup.add(this.createLine(startVec.set(i, -100, -100), endVec.set(i, -100, -105), greenMaterial));
      this.expressionGroup.add(this.createLine(startVec.set(-100, -100, i), endVec.set(-105, -100, i), blueMaterial));
      this.expressionGroup.add(this.createLine(startVec.set(-100, i, -100), endVec.set(-105, i, -105), redMaterial));
    }

    if(this.renderingMethod === "vertices"){
      this.expressionGroup.add(this.createExpressionDots(expPoints));
    }

    if(this.renderingMethod === "edges"){
      for(let x=0; x<expPoints.length; x++){
        for(let y=0; y<expPoints[x].length; y++){
          const expSquares = this.createExpressionSquare(expPoints, x, y);
          if(expSquares != null){
            this.expressionGroup.add(expSquares);
          }
        }
      }
    }

    if(this.renderingMethod === "faces"){
      for(let x=0; x<expPoints.length; x++){
        for(let y=0; y<expPoints[x].length; y++){
          const expPlanes = this.createExpressionPlane(expPoints, x, y)
          if(expPlanes != null){
            this.expressionGroup.add(expPlanes);
          }
        }
      }
    }

    this.scene.add(this.expressionGroup);
  }

  rangeScale(n, nRangeMin, nRangeMax, outRangeMin, outRangeMax){
    return (n - nRangeMin) * (outRangeMax - outRangeMin) / (nRangeMax - nRangeMin) + outRangeMin;
  }

  evaluateExpression(){
    let xPoints = [];
    const step = (this.xRange[1]-this.xRange[0])/this.detail;

    if(this.expression.includes("x") || this.expression.includes("y")){
      try{
        for(let x=this.xRange[0]; x<=this.xRange[1]; x+=step){
          let xEval = this.expression.replaceAll("x", "("+x+")");
          let yPoints = [];

          for(let y=this.yRange[0]; y<=this.yRange[1]; y+=step){
            let zEval;

            if(xEval.includes("y")){
              let yEval = xEval.replaceAll("y", "("+y+")");
              zEval = evaluate(yEval);
            }
            else{
              zEval = evaluate(xEval);
            }

            if(zEval>=this.zRange[0] && zEval<=this.zRange[1]){
              const xPos = this.rangeScale(x, this.xRange[0], this.xRange[1], -100, 100);
              const yPos = this.rangeScale(zEval, this.zRange[0], this.zRange[1], -100, 100);
              const zPos = this.rangeScale(y, this.yRange[0], this.yRange[1], -100, 100);
              yPoints.push(new THREE.Vector3(xPos, yPos, zPos));
            }
          }

          if(yPoints.length > 0){
            xPoints.push(yPoints);
          }
        }
      } catch(e) {
        alert("Error when solving for Z: " + e);
      }
    }

    return xPoints;
  }

  createLine(startVec, endVec, material){
    const linePoints = [startVec, endVec];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const line = new THREE.Line(lineGeometry, material);
    return line;
  }

  createText(string, size, x, y, z, color){
    const text = new SpriteText(string, size, color);
    text.position.x = x;
    text.position.y = y;
    text.position.z = z;
    text.fontFace = "Consolas";
    return text;
  }

  createAxisUnit(string, x, y, z, color){
    const text = new SpriteText(string, 4, color);
    text.position.x = x;
    text.position.y = y;
    text.position.z = z;
    text.fontFace = "Consolas";
    return text;
  }

  createExpressionDots(expPoints){
    const points = [].concat.apply([], expPoints);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.PointsMaterial({color: white, size: 0.25});
    return new THREE.Points(geometry, material);
  }

  createExpressionSquare(expPoints, x, y){
    const isValidPoint = expPoints[x+1] !== undefined;

    if(isValidPoint){
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
        return new THREE.Line(geometry, whiteMaterial);
      }
    }

    return null;
  }

  createExpressionPlane(expPoints, x, y){
    const isValidPoint = expPoints[x+1] !== undefined;

    if(isValidPoint){
      const firstTriangleValid = expPoints[x+1][y] !== undefined && expPoints[x+1][y+1] !== undefined;
      const secondTriangleValid = expPoints[x][y+1] !== undefined && expPoints[x+1][y+1] !== undefined;
      const downardsTriangleValid = expPoints[x][y+1] !== undefined && expPoints[x+1][y] !== undefined;

      let downardsTriangleNeeded = true;
      let planeGeometry = new THREE.BufferGeometry().setFromPoints([]);
      if(firstTriangleValid){
        downardsTriangleNeeded = false;
        const planePointsBottomTriangle = [expPoints[x][y], expPoints[x+1][y], expPoints[x+1][y+1]];
        planeGeometry = BufferGeometryUtils.mergeBufferGeometries([planeGeometry, new THREE.BufferGeometry().setFromPoints(planePointsBottomTriangle)]);
      }
      if(secondTriangleValid){
        downardsTriangleNeeded = false;
        const planePointsTopTriangle = [expPoints[x][y], expPoints[x][y+1], expPoints[x+1][y+1]];
        planeGeometry = BufferGeometryUtils.mergeBufferGeometries([planeGeometry, new THREE.BufferGeometry().setFromPoints(planePointsTopTriangle)]);
      }
      if(downardsTriangleNeeded && downardsTriangleValid){
        const planePointsDownardsTriangle = [expPoints[x][y], expPoints[x][y+1], expPoints[x+1][y]];
        planeGeometry = BufferGeometryUtils.mergeBufferGeometries([planeGeometry, new THREE.BufferGeometry().setFromPoints(planePointsDownardsTriangle)]);
      }

      let colour = null;
      if(expPoints[x+1][y+1] !== undefined){
        colour = this.getColourForY(expPoints[x][y].y + (expPoints[x+1][y+1].y - expPoints[x][y].y)/2);
      }
      else{
        colour = this.getColourForY(expPoints[x][y].y);
      }
      const material = new THREE.MeshBasicMaterial({color: colour, side: THREE.DoubleSide});

      return new THREE.Mesh(planeGeometry, material);
    }

    return null;
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
