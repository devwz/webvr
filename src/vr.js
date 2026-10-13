import { VRButton } from 'three/addons/webxr/VRButton.js';

export function mountVRButton(renderer, container, onSessionChange) {
  const button = VRButton.createButton(renderer, {
    requiredFeatures: ['local-floor'],
  });
  button.setAttribute('aria-label', 'Iniciar experiência em realidade virtual');
  container.appendChild(button);

  const handleSessionStart = () => onSessionChange(true);
  const handleSessionEnd = () => onSessionChange(false);
  renderer.xr.addEventListener('sessionstart', handleSessionStart);
  renderer.xr.addEventListener('sessionend', handleSessionEnd);

  return () => {
    button.remove();
    renderer.xr.removeEventListener('sessionstart', handleSessionStart);
    renderer.xr.removeEventListener('sessionend', handleSessionEnd);
  };
}
