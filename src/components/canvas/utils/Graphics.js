import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Graphics{
  constructor(canvas, width, height){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height, 1, 500);
    camera.position.set(150, 150, 150);
    // camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setSize(width, height);
    renderer.setClearColor("rgb(40, 44, 52)");

    const controls = new OrbitControls(camera, renderer.domElement);

    const xAxisMaterial = new THREE.LineBasicMaterial({color: "rgb(36, 173, 48)"});
    const xAxisPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 0, 0)];
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints(xAxisPoints);
    const xAxisLine = new THREE.Line(xAxisGeometry, xAxisMaterial);

    const yAxisMaterial = new THREE.LineBasicMaterial({color: "rgb(207, 43, 43)"});
    const yAxisPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 100, 0)];
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints(yAxisPoints);
    const yAxisLine = new THREE.Line(yAxisGeometry, yAxisMaterial);

    const zAxisMaterial = new THREE.LineBasicMaterial({color: "rgb(43, 125, 207)"});
    const zAxisPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 100)];
    const zAxisGeometry = new THREE.BufferGeometry().setFromPoints(zAxisPoints);
    const zAxisLine = new THREE.Line(zAxisGeometry, zAxisMaterial);

    scene.add(xAxisLine);
    scene.add(yAxisLine);
    scene.add(zAxisLine);

    const animate = () => {
    	requestAnimationFrame(animate);
    	renderer.render(scene, camera);
      controls.update();
    }

    animate();
  }
}
