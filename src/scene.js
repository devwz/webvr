import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_URL = `${import.meta.env.BASE_URL}models/indoor.glb`;

export function createScene(viewport) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#17211f');

  const playerRig = new THREE.Group();
  playerRig.name = 'PlayerRig';
  scene.add(playerRig);

  const camera = new THREE.PerspectiveCamera(68, 1, 0.05, 500);
  camera.position.set(0, 1.6, 8);
  playerRig.add(camera);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local-floor');
  renderer.domElement.className = 'scene-canvas';
  renderer.domElement.setAttribute('aria-label', 'Canvas da cena 3D');
  viewport.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xdde9df, 0x6e746d, 2.1));
  const keyLight = new THREE.DirectionalLight(0xffdfb2, 2.3);
  keyLight.position.set(-4, 8, 5);
  scene.add(keyLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 0.5;
  controls.maxDistance = 80;
  controls.target.set(0, 1.2, 0);

  const loader = new GLTFLoader();
  const ready = new Promise((resolve, reject) => {
    loader.load(
      MODEL_URL,
      (gltf) => {
        const model = gltf.scene;
        model.name = 'IndoorModel';
        scene.add(model);
        model.updateMatrixWorld(true);

        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        const largestDimension = Math.max(size.x, size.y, size.z, 1);
        playerRig.position.set(center.x, 0, center.z);
        camera.position.set(0, Math.max(size.y * 0.7, largestDimension * 0.55), largestDimension * 1.35);
        controls.target.set(0, Math.max(0.5, size.y * 0.48), 0);
        controls.maxDistance = largestDimension * 5;
        controls.update();

        resolve({ gltf, model, bounds, size, center });
      },
      (event) => {
        if (event.lengthComputable) {
          viewport.dispatchEvent(new CustomEvent('modelprogress', {
            detail: event.loaded / event.total,
          }));
        }
      },
      reject,
    );
  });

  const resize = () => {
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewport);
  resize();

  return {
    camera,
    controls,
    playerRig,
    renderer,
    scene,
    ready,
    dispose() {
      resizeObserver.disconnect();
      controls.dispose();
      renderer.setAnimationLoop(null);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
