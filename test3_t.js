// Import Three.js from the CDN
//import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";
//import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.161.0/three.module.min.js";
import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

document.addEventListener("DOMContentLoaded", () => {
  const GRAVITY = -9.80665;
  const JUMP_VELOCITY = 8;
  let velocity = new THREE.Vector3(0, 0, 0);
  let isOnGround = true;

  var moveSpeed = 0.05;

  let moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

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

  var geometry2 = new THREE.SphereGeometry(1, 10, 10);
  var meterial2 = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  var sphere1 = new THREE.Mesh(geometry2, meterial2);
  scene.add(sphere1);

  sphere1.position.x = Math.random() * 10;
  sphere1.position.z = Math.random() * 10;

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
    console.log(event.key);

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
      case "Shift":
        moveSpeed = 0.3;
        break;
      case " ":
        if (isOnGround) {
          velocity.y = JUMP_VELOCITY;
          isOnGround = false;
        }
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

    // Apply gravity
    if (!isOnGround) {
      velocity.y += GRAVITY * 0.01; // Note: Scaling factor for consistent frame rates
    }

    // Update player position with velocity
    player.position.y += velocity.y * 0.01; // Note: Scaling factor for consistent frame rates

    // Check if player is on the ground
    if (player.position.y <= 1) {
      player.position.y = 1;
      velocity.y = 0;
      isOnGround = true;
    }

    sphere1.rotation.x += 0.01;
    sphere1.rotation.y += 0.01;

    sphere1.scale.x = 2 + Math.sin(Date.now() * 0.001) * 1;
    sphere1.scale.y = 2 + Math.sin(Date.now() * 0.001) * 1;
    sphere1.scale.z = 2 + Math.sin(Date.now() * 0.001) * 1;

    var directoin = new THREE.Vector3();
    directoin.subVectors(cube.position, sphere1.position).normalize();
    var speed = 0.02;
    sphere1.position.add(directoin.multiplyScalar(speed));

    // implement gravity
    if (cube.position.y > 0.5) {
      cube.position.y -= 0.1;
    }

    // sphere1.scale.x += 0.01;
    // sphere1.scale.y += 0.01;
    // sphere1.scale.z += 0.01;

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
