import { createScene } from './scene.js';
import { createPerformanceMeter } from './performance.js';
import { mountVRButton } from './vr.js';
import { createCollisionWorld } from './collisions.js';
import { createLocomotion } from './locomotion.js';
import './style.css';

const viewport = document.querySelector('#viewport');
const statusText = document.querySelector('#status-text');
const statusDot = document.querySelector('#status-dot');
const performanceText = document.querySelector('#performance');
const loadState = document.querySelector('#load-state');
const loadBar = document.querySelector('#load-bar');
const loadLabel = document.querySelector('#load-label');
const errorState = document.querySelector('#error-state');
const errorMessage = document.querySelector('#error-message');
const sceneMeta = document.querySelector('#scene-meta');
const meshCount = document.querySelector('#mesh-count');
const vrEntry = document.querySelector('#vr-entry');
const walkSpeed = document.querySelector('#walk-speed');
const walkSpeedValue = document.querySelector('#walk-speed-value');

const setStatus = (message, state = 'ready') => {
  statusText.textContent = message;
  statusDot.dataset.state = state;
};

const showError = (message) => {
  errorMessage.textContent = message;
  errorState.hidden = false;
  loadState.hidden = true;
  setStatus('Falha ao carregar', 'error');
};

if (!window.isSecureContext) {
  setStatus('Contexto sem HTTPS', 'error');
}

try {
  const app = createScene(viewport);
  const meter = createPerformanceMeter(performanceText);
  let locomotion;
  const removeVRButton = mountVRButton(app.renderer, vrEntry, (active) => {
    viewport.classList.toggle('is-vr', active);
    setStatus(active ? 'Sessão imersiva ativa' : 'Cena pronta', active ? 'vr' : 'ready');
    if (!active) locomotion?.reset();
  });

  viewport.addEventListener('modelprogress', (event) => {
    const percent = Math.round(event.detail * 100);
    loadBar.style.width = `${percent}%`;
    loadLabel.textContent = `Lendo indoor.glb · ${percent}%`;
  });

  app.ready.then(({ gltf, size, model }) => {
    const meshes = [];
    const materials = new Set();
    gltf.scene.traverse((object) => {
      if (!object.isMesh) return;
      meshes.push(object);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        if (material) materials.add(material);
      }
    });

    meshCount.textContent = `${meshes.length} MESHES`;
    sceneMeta.textContent = `${size.x.toFixed(1)} × ${size.y.toFixed(1)} × ${size.z.toFixed(1)} unidades · ${materials.size} materiais`;
    const collisionWorld = createCollisionWorld(model);
    locomotion = createLocomotion({
      camera: app.camera,
      playerRig: app.playerRig,
      renderer: app.renderer,
      collisionWorld,
      speed: Number(walkSpeed.value),
    });
    loadState.hidden = true;
    setStatus('Cena pronta', 'ready');
  }).catch((error) => {
    showError(error instanceof Error ? error.message : 'Erro desconhecido ao carregar indoor.glb.');
  });

  walkSpeed.addEventListener('input', () => {
    const speed = Number(walkSpeed.value);
    walkSpeedValue.value = `${speed.toFixed(1)} m/s`;
    locomotion?.setSpeed(speed);
  });

  let previousFrame = null;
  app.renderer.setAnimationLoop((now) => {
    const delta = previousFrame === null ? 0 : Math.min((now - previousFrame) / 1000, 0.05);
    previousFrame = now;

    if (app.renderer.xr.isPresenting) locomotion?.update(delta);
    else app.controls.update();
    app.renderer.render(app.scene, app.camera);
    meter.tick(now);
  });

  window.addEventListener('beforeunload', () => {
    removeVRButton();
    app.dispose();
  }, { once: true });

  window.addEventListener('error', (event) => {
    if (event.error) showError(event.error.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    showError(reason instanceof Error ? reason.message : 'Erro inesperado durante a inicialização.');
  });
} catch (error) {
  showError(error instanceof Error ? error.message : 'Não foi possível inicializar o renderizador WebGL.');
}
