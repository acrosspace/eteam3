import * as THREE from "three";

document.addEventListener("DOMContentLoaded", () => {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer();

  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  camera.position.set(0, 5, 5);
  camera.lookAt(0, 0, 0);

  var geometry1 = new THREE.BoxGeometry(1, 1, 1);
  var material1 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  var cube1 = new THREE.Mesh(geometry1, material1);
  scene.add(cube1);

  renderer.render(scene, camera);
});
