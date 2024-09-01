import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("hello");

  var hello = document.createElement("div");

  document.body.appendChild(hello);

  hello.innerHTML = "Hello, World!";

  console.log(hello);

  var fps = 60; // frame per second

  class PhysicsEngine {
    gravity = -9.8; // 초당 속도의 변화량
    speed = 0;

    test = () => {
      this.speed += this.gravity / fps;
      console.log(this.speed);
    };
  }

  var myPhysicsEngine = new PhysicsEngine();

  console.log(myPhysicsEngine.gravity);

  //P
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.set(0, 5, 5);
  camera.lookAt(0, 0, 0);

  const gridSize = 30;
  const gridDivisions = 30;
  const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
  scene.add(gridHelper);

  const controls = new OrbitControls(camera, renderer.domElement);

  let model;
  const loader = new GLTFLoader();
  loader.load(
    "./Demon.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );

  setInterval(() => {
    myPhysicsEngine.test();

    if (model) {
      console.log(model.position.y);

      //model.position.y += myPhysicsEngine.speed / fps;

      // render
      renderer.render(scene, camera);
    }
  }, 1000 / fps);
});
