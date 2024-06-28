// Import Three.js from the CDN
//import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";
//import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.161.0/three.module.min.js";
import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

document.addEventListener("DOMContentLoaded", () => {
  let moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  const playerObjects = {};

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.set(0, 5, 5);

  const girdSize = 10;
  const gridDivisions = 10;
  const gridHelper = new THREE.GridHelper(girdSize, gridDivisions);
  scene.add(gridHelper);

  // Box(charactor) geometry setup
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Coins
  const coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 100);
  const coinMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  const coins = [];
  let collectedCoins = 0;
  for (let i = 0; i < 10; i++) {
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.position.set(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
    coin.rotation.x = Math.PI / 2;
    // make rotation z random between 0 and 360 degrees
    coin.rotation.z = Math.random() * Math.PI * 2;
    scene.add(coin);
    coins.push(coin);
  }

  const coinCountElement = document.getElementById("coin-count");
  coinCountElement.innerHTML = `coins: ${collectedCoins}`;

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;

  const positionPrev = new THREE.Vector3();

  // Handle keyboard events
  let isPositionUpdatable = false;
  const updateMovementState = (event, isKeyDown) => {
    switch (event.key) {
      case "w":
        moveState.forward = isKeyDown;
        isPositionUpdatable = true;
        console.log("w");
        break;
      case "a":
        moveState.left = isKeyDown;
        isPositionUpdatable = true;
        console.log("a");
        break;
      case "s":
        moveState.backward = isKeyDown;
        isPositionUpdatable = true;
        console.log("s");
        break;
      case "d":
        moveState.right = isKeyDown;
        isPositionUpdatable = true;
        console.log("d");
        break;
    }

    if (!isKeyDown) isPositionUpdatable = false;
  };

  window.addEventListener("keydown", (event) =>
    updateMovementState(event, true)
  );
  window.addEventListener("keyup", (event) =>
    updateMovementState(event, false)
  );

  // Animation loop
  const animate = function () {
    requestAnimationFrame(animate);

    const moveSpeed = 0.05;
    if (moveState.forward) cube.position.z -= moveSpeed;
    if (moveState.backward) cube.position.z += moveSpeed;
    if (moveState.left) cube.position.x -= moveSpeed;
    if (moveState.right) cube.position.x += moveSpeed;

    //   if (isPositionUpdatable) {
    //     console.log(cube.position);
    //   }

    if (positionPrev.equals(cube.position) === false) {
      console.log(cube.position);
    }

    positionPrev.copy(cube.position);

    //controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    // Collision detection
    const playerBox = new THREE.Box3().setFromObject(cube);

    for (let i = 0; i < coins.length; i++) {
      const coinBox = new THREE.Box3().setFromObject(coins[i]);
      if (playerBox.intersectsBox(coinBox)) {
        scene.remove(coins[i]);
        coins.splice(i, 1);
        i--; // Adjust index after removal
      }
    }

    renderer.render(scene, camera);
  };

  animate();
});
