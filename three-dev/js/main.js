import * as THREE from 'three';

import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';
import {VRButton} from 'three/addons/webxr/VRButton.js';

let camera, scene, renderer, sphere1, clouds;

init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  camera.position.set(16, 16, -40);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));
  renderer.xr.enabled = true;

  // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  // directionalLight.position.set(2.5, 5, 2.5);
  // scene.add(directionalLight);

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  // scene.add(ambientLight);

  new RGBELoader()
    .setPath('/~abdura/three-js/world/textures/')
    .load('overcast2.hdr', function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      renderer.render(scene, camera);

      // model

      const loader = new GLTFLoader().setPath('/~abdura/three-js/2/models/');
      loader.load('World_Blender/world.gltf', async function (gltf) {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        // model.position.set(8, 1.5, 0);
        // wait until the model can be added to the scene without blocking due to shader compilation
        await renderer.compileAsync(model, camera, scene);
        scene.add(model);
        renderer.render(scene, camera);
      });
    });
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
  // requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // console.log(camera.position);
  // console.log(camera.rotation);
}

window.addEventListener('resize', resize, false);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
