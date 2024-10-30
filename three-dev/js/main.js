import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

let container,
  camera,
  scene,
  renderer,
  cube,
  wireframe1,
  wireframe2,
  wireframe3,
  lastTime;

init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  camera.position.set(7, 5, 7);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);

  const geometry1 = new THREE.SphereGeometry(0.9, 32, 16);
  const material = new THREE.MeshPhongMaterial({color: 0xfcfcfc});
  const sphere1 = new THREE.Mesh(geometry1, material);
  scene.add(sphere1);
  sphere1.position.set(1, 0.7, 1);

  const geometry2 = new THREE.SphereGeometry(0.7, 32, 16);
  const sphere2 = new THREE.Mesh(geometry2, material);
  scene.add(sphere2);
  sphere2.position.set(1, 1.95, 1);

  camera.lookAt(sphere2.position);

  const geometry3 = new THREE.SphereGeometry(0.55, 32, 16);
  const sphere3 = new THREE.Mesh(geometry3, material);
  scene.add(sphere3);
  sphere3.position.set(1, 3, 1);

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });

  wireframe1 = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 8, 4),
    wireframeMaterial
  );
  scene.add(wireframe1);
  wireframe1.position.set(1, 0.7, 1);

  wireframe2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 8, 4),
    wireframeMaterial
  );
  scene.add(wireframe2);
  wireframe2.position.set(1, 1.95, 1);

  wireframe3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.75, 8, 4),
    wireframeMaterial
  );
  scene.add(wireframe3);
  wireframe3.position.set(1, 3, 1);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(2.5, 5, 2.5);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  lastTime = performance.now(); // Initialize lastTime
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
  const currentTime = performance.now();
  const delta = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  wireframe1.rotation.x += 0.13 * delta;
  wireframe2.rotation.x += 0.15 * delta;
  wireframe3.rotation.x += 0.18 * delta;

  wireframe1.rotation.y += 0.25 * delta;
  wireframe2.rotation.y += 0.19 * delta;
  wireframe3.rotation.y += 0.3 * delta;

  wireframe1.rotation.z += 0.35 * delta;
  wireframe2.rotation.z += 0.23 * delta;
  wireframe3.rotation.z += 0.33 * delta;

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', resize, false);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
