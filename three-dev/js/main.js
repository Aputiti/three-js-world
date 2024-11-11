import * as THREE from 'three';

import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';

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

  camera.position.set(0.05, 5.8, 11);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  const earthTexture = new THREE.TextureLoader()
    .setPath('/~abdura/three-js/2/textures/')
    .load('/earth_materials/earth_atmos_2048.jpeg');

  const bumpMap = new THREE.TextureLoader()
    .setPath('/~abdura/three-js/2/textures/')
    .load('/earth_materials/earth_bump.jpeg');

  const normalMap = new THREE.TextureLoader()
    .setPath('/~abdura/three-js/2/textures/')
    .load('/earth_materials/earth_normal_2048.jpeg');

  const specularMap = new THREE.TextureLoader()
    .setPath('/~abdura/three-js/2/textures/')
    .load('/earth_materials/earth_specular_2048.jpeg');

  const nightLightsMap = new THREE.TextureLoader()
    .setPath('/~abdura/three-js/2/textures/')
    .load('/earth_materials/earth_lights_2048.png');

  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: bumpMap,
    bumpScale: 0.05,
    normalMap: normalMap,
    specularMap: specularMap,
    specular: new THREE.Color(0x333333),
  });

  const geometry1 = new THREE.SphereGeometry(1, 64, 32);
  // const material = new THREE.MeshPhongMaterial({color: 0xfcfcfc});
  sphere1 = new THREE.Mesh(geometry1, earthMaterial);
  scene.add(sphere1);
  sphere1.position.set(-8, 1.5, 0);
  sphere1.scale.set(2, 2, 2);

  earthMaterial.emissiveMap = nightLightsMap;
  earthMaterial.emissive = new THREE.Color(0x111111);

  const cloudGeometry = new THREE.SphereGeometry(2.05, 64, 32);
  const cloudTexture = new THREE.TextureLoader()
    .setPath('/~abdura/three-js/2/textures/')
    .load('/earth_materials/earth_clouds_2048.png');
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.8,
  });
  clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);

  scene.add(clouds);
  clouds.position.set(-8, 1.5, 0);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(2.5, 5, 2.5);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  new RGBELoader()
    .setPath('/~abdura/three-js/2/textures/')
    .load('warm_restaurant_night_2k.hdr', function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      renderer.render(scene, camera);

      // model

      const loader = new GLTFLoader().setPath('/~abdura/three-js/2/models/');
      loader.load('barrel_own/barrel.gltf', async function (gltf) {
        const model = gltf.scene;
        model.scale.set(3, 3, 3);
        model.position.set(8, 1.5, 0);
        // wait until the model can be added to the scene without blocking due to shader compilation
        await renderer.compileAsync(model, camera, scene);
        scene.add(model);
        renderer.render(scene, camera);
      });
      loader.load('myBlenderScene/blend1.gltf', async function (gltf) {
        const model2 = gltf.scene;
        // model2.scale.set(0.05, 0.05, 0.05);
        model2.position.set(0, 0, 0);
        // wait until the model can be added to the scene without blocking due to shader compilation
        await renderer.compileAsync(model2, camera, scene);
        scene.add(model2);
        renderer.render(scene, camera);
      });
      loader.load('orange_fruit/scene.gltf', async function (gltf) {
        const model3 = gltf.scene;
        model3.scale.set(0.0175, 0.0175, 0.0175);
        model3.position.set(4, 0.2, 4);
        // wait until the model can be added to the scene without blocking due to shader compilation
        await renderer.compileAsync(model3, camera, scene);
        scene.add(model3);
        renderer.render(scene, camera);
      });
    });
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
  // requestAnimationFrame(animate);
  sphere1.rotation.y += 0.001;
  clouds.rotation.y += 0.002;
  renderer.render(scene, camera);
  // console.log(camera.position);
}

window.addEventListener('resize', resize, false);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
