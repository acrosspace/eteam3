import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import RAPIER from "https://cdn.skypack.dev/@dimforge/rapier3d-compat";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("hello");

  await RAPIER.init();
  var gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
  var world = new RAPIER.World(gravity);

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
      //console.log(this.speed);
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

  camera.position.set(0, 20, 20);
  camera.lookAt(0, 0, 0);

  const gridSize = 30;
  const gridDivisions = 30;
  const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
  scene.add(gridHelper);

  const controls = new OrbitControls(camera, renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 5);
  scene.add(ambientLight);

  var geometry0 = new THREE.BoxGeometry(20, 2, 2);
  var material0 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  var cube0 = new THREE.Mesh(geometry0, material0);
  scene.add(cube0);
  cube0.position.y = 0;

  var geometry1 = new THREE.BoxGeometry();
  var material1 = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0,
  });
  var cube1 = new THREE.Mesh(geometry1, material1);
  scene.add(cube1);

  //cube1.add(cube0);

  var rigidBodyDesc1 = RAPIER.RigidBodyDesc.dynamic();
  rigidBodyDesc1.setTranslation(0, 5, 0);

  var rigidBodyCube1 = world.createRigidBody(rigidBodyDesc1);
  rigidBodyCube1.lockRotations(true);

  var colliderDesc1 = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);

  world.createCollider(colliderDesc1, rigidBodyCube1);

  var geometry2 = new THREE.BoxGeometry(100, 1, 100);
  var material2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  var cube2 = new THREE.Mesh(geometry2, material2);
  scene.add(cube2);

  var rigidBodyDesc2 = RAPIER.RigidBodyDesc.fixed();
  rigidBodyDesc2.setTranslation(0, 0, 0);

  var rigidBodyCube2 = world.createRigidBody(rigidBodyDesc2);

  var colliderDesc2 = RAPIER.ColliderDesc.cuboid(50, 0.5, 50);

  colliderDesc1.setRestitution(0.1);
  colliderDesc2.setRestitution(0.1);

  world.createCollider(colliderDesc2, rigidBodyCube2);

  rigidBodyCube1.applyImpulse(new RAPIER.Vector3(0.0, 5.0, 0.0));

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

    if (event.key === "j") {
      console.log(rigidBodyCube1.translation());

      if (rigidBodyCube1.translation().y < 1) {
        // jump
        rigidBodyCube1.applyImpulse(new RAPIER.Vector3(0.0, 5.0, 0.0));
      }
    } else if (event.key === "w") {
      // forward
      //rigidBodyCube1.applyImpulse(new RAPIER.Vector3(0.0, 0.0, 2.0));
      rigidBodyCube1.setLinvel(new RAPIER.Vector3(0.0, 0.0, 5.0));
    } else if (event.key === "s") {
      // forward
      //rigidBodyCube1.applyImpulse(new RAPIER.Vector3(0.0, 0.0, 2.0));
      rigidBodyCube1.setLinvel(new RAPIER.Vector3(0.0, 0.0, -5.0));
    } else if (event.key === "a") {
      // forward
      //rigidBodyCube1.applyImpulse(new RAPIER.Vector3(0.0, 0.0, 2.0));
      rigidBodyCube1.setLinvel(new RAPIER.Vector3(5.0, 0.0, 0.0));
    } else if (event.key === "d") {
      // forward
      //rigidBodyCube1.applyImpulse(new RAPIER.Vector3(0.0, 0.0, 2.0));
      rigidBodyCube1.setLinvel(new RAPIER.Vector3(-5.0, 0.0, 0.0));
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

      cube1.add(model);

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

    //world.timestep = Math.min(delta, 0.1);
    world.step();

    cube0.rotation.y += 0.01;

    const position1 = rigidBodyCube1.translation();
    const rotation1 = rigidBodyCube1.rotation();

    cube1.position.copy(position1);
    cube1.quaternion.copy(rotation1);

    const position2 = rigidBodyCube2.translation();
    const rotation2 = rigidBodyCube2.rotation();

    cube2.position.copy(position2);
    cube2.quaternion.copy(rotation2);

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
