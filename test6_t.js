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

  var direction = "";
  var turn = "";
  var speed = 0.01;

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

  const ambientLight = new THREE.AmbientLight(0xffffff, 5);
  scene.add(ambientLight);

  window.addEventListener("keydown", (event) => {
    console.log(event.key);

    if (event.key === "ArrowUp") {
      direction = "forward";
    } else if (event.key === "ArrowDown") {
      direction = "backward";
    }

    if (event.key === "ArrowLeft") {
      turn = "left";
      console.log(turn);
    } else if (event.key === "ArrowRight") {
      turn = "right";
    }

    if (event.key === "Shift") {
      speed = 0.1;
    }
  });

  window.addEventListener("keyup", (event) => {
    turn = "";

    if (event.key == "ArrowUp" || event.key == "ArrowDown") {
      direction = "";
    }

    const action = mixer.clipAction(gltf.animations[10]);
    action.play();
  });

  let model;
  let mixer;
  const loader = new GLTFLoader();
  loader.load(
    "./Demon.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);

      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[1]);
        action.play();
      }
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );

  const clock = new THREE.Clock();

  setInterval(() => {
    const delta = clock.getDelta();

    if (mixer) {
      mixer.update(delta);
    }

    myPhysicsEngine.test();

    if (model) {
      if (direction == "forward") {
        //model.position.z += 0.01;
        model.translateZ(speed);
      } else if (direction == "backward") {
        //model.position.z -= 0.01;
        model.translateZ(-speed);
      }

      if (turn == "left") {
        model.rotation.y += speed;
      } else if (turn == "right") {
        model.rotation.y -= speed;
      }

      //console.log(model.position.y);

      //model.position.y += myPhysicsEngine.speed / fps;

      // render
      renderer.render(scene, camera);
    }
  }, 1000 / fps);
});
