import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

document.addEventListener("DOMContentLoaded", () => {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer();

  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  camera.position.set(0, 15, 15);
  camera.lookAt(0, 0, 0);

  const girdSize = 25;
  const gridDivisions = 25;
  const gridHelper = new THREE.GridHelper(girdSize, gridDivisions);
  scene.add(gridHelper);

  const controls = new OrbitControls(camera, renderer.domElement);

  var geometry1 = new THREE.BoxGeometry(1, 1, 1);
  var material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  var cube1 = new THREE.Mesh(geometry1, material1);
  scene.add(cube1);

  var geometry2 = new THREE.SphereGeometry(1, 10, 10);
  var meterial2 = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  var sphere1 = new THREE.Mesh(geometry2, meterial2);
  scene.add(sphere1);

  // Coins8
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

  window.addEventListener("keydown", (event) => {
    console.log(event.key);

    if (event.key == "w") {
      cube1.position.z = cube1.position.z + 1;
    }
  });
  window.addEventListener("keyup", (event) => {
    console.log(event.key);
  });

  function animate() {
    requestAnimationFrame(animate);

    sphere1.rotation.x += 0.01;
    sphere1.rotation.y += 0.01;

    // Collision detection
    const playerBox = new THREE.Box3().setFromObject(cube1);

    for (let i = 0; i < coins.length; i++) {
      const coinBox = new THREE.Box3().setFromObject(coins[i]);
      if (playerBox.intersectsBox(coinBox)) {
        scene.remove(coins[i]);
        coins.splice(i, 1);
        i--; // Adjust index after removal

        console.log(conis.length);
      }
    }

    renderer.render(scene, camera);
  }

  animate();
});
