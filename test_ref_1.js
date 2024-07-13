// Import Three.js from the CDN
//import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";
//import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.161.0/three.module.min.js";
import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

document.addEventListener("DOMContentLoaded", () => {
  // Setup basic scene, camera, and renderer
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

  // OrbitControls for direction
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI / 2;

  // Physics variables
  const GRAVITY = -9.80665;
  const JUMP_VELOCITY = 8;
  let velocity = new THREE.Vector3(0, 0, 0);
  let isOnGround = true;

  // Player
  const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
  const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.y = 1;
  scene.add(player);

  // Ground
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0x888888,
    side: THREE.DoubleSide,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  camera.position.set(0, 5, 10);
  controls.update();

  // Event listener for movement
  const keys = {};
  document.addEventListener("keydown", (event) => {
    keys[event.code] = true;
  });
  document.addEventListener("keyup", (event) => {
    keys[event.code] = false;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Apply gravity
    if (!isOnGround) {
      velocity.y += GRAVITY * 0.01; // Note: Scaling factor for consistent frame rates
    }

    // Move player based on keys pressed
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const sideways = new THREE.Vector3();
    sideways.crossVectors(camera.up, forward);
    sideways.normalize();

    if (keys["KeyW"]) player.position.addScaledVector(forward, 0.1);
    if (keys["KeyS"]) player.position.addScaledVector(forward, -0.1);
    if (keys["KeyA"]) player.position.addScaledVector(sideways, -0.1); // Corrected direction
    if (keys["KeyD"]) player.position.addScaledVector(sideways, 0.1); // Corrected direction

    // Jumping
    if (keys["Space"] && isOnGround) {
      velocity.y = JUMP_VELOCITY;
      isOnGround = false;
    }

    // Update player position with velocity
    player.position.y += velocity.y * 0.01; // Note: Scaling factor for consistent frame rates

    // Check if player is on the ground
    if (player.position.y <= 1) {
      player.position.y = 1;
      velocity.y = 0;
      isOnGround = true;
    }

    // Update the camera to follow the player
    camera.position.set(
      player.position.x,
      player.position.y + 5,
      player.position.z + 10
    );
    camera.lookAt(player.position);

    // Update controls
    controls.update();

    renderer.render(scene, camera);
  }

  animate();
});
