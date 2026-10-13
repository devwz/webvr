import { Vector3 } from 'three';
import { createPlayerCapsule, resolveCapsuleMotion } from './collisions.js';

const DEADZONE = 0.18;
const GRAVITY = 9.81;
const MAX_FALL_SPEED = 18;
const UP = new Vector3(0, 1, 0);

export function readThumbstick(inputSources) {
  let selectedSource;
  let fallbackSource;

  for (const source of inputSources) {
    if (!source.gamepad) continue;
    if (source.handedness === 'left') {
      selectedSource = source;
      break;
    }
    if (!source.handedness) fallbackSource ??= source;
  }

  const axes = (selectedSource ?? fallbackSource)?.gamepad?.axes;
  if (!axes || axes.length < 2) return { x: 0, y: 0 };

  const thumbstickOffset = axes.length >= 4 ? 2 : 0;
  let x = Number.isFinite(axes[thumbstickOffset]) ? axes[thumbstickOffset] : 0;
  let y = Number.isFinite(axes[thumbstickOffset + 1]) ? axes[thumbstickOffset + 1] : 0;
  const magnitude = Math.hypot(x, y);

  if (magnitude <= DEADZONE) return { x: 0, y: 0 };

  const normalizedMagnitude = Math.min(1, (magnitude - DEADZONE) / (1 - DEADZONE));
  const scale = normalizedMagnitude / magnitude;
  x *= scale;
  y *= scale;

  return { x, y };
}

export function getPlanarMovement(cameraDirection, axes, target = new Vector3()) {
  const forward = target.copy(cameraDirection);
  forward.y = 0;
  if (forward.lengthSq() < 1e-8) return target.set(0, 0, 0);

  forward.normalize();
  const right = new Vector3().crossVectors(forward, UP).normalize();
  target.copy(forward).multiplyScalar(-axes.y).addScaledVector(right, axes.x);
  if (target.lengthSq() > 1) target.normalize();
  return target;
}

export function createLocomotion({ camera, playerRig, renderer, collisionWorld, speed = 1.6 }) {
  const capsule = createPlayerCapsule();
  const headPosition = new Vector3();
  const cameraDirection = new Vector3();
  const movement = new Vector3();
  const frameDelta = new Vector3();
  let walkSpeed = speed;
  let verticalSpeed = 0;

  return {
    update(deltaSeconds) {
      if (!renderer.xr.isPresenting) {
        verticalSpeed = 0;
        return;
      }

      const session = renderer.xr.getSession();
      if (!session) return;

      const delta = Math.min(Math.max(deltaSeconds, 0), 0.05);
      camera.getWorldPosition(headPosition);
      capsule.start.set(headPosition.x, headPosition.y - 1.28, headPosition.z);
      capsule.end.set(headPosition.x, headPosition.y - 0.38, headPosition.z);

      const axes = readThumbstick(session.inputSources);
      camera.getWorldDirection(cameraDirection);
      getPlanarMovement(cameraDirection, axes, movement);
      frameDelta.copy(movement).multiplyScalar(walkSpeed * delta);

      verticalSpeed = Math.max(-MAX_FALL_SPEED, verticalSpeed - GRAVITY * delta);
      frameDelta.y = verticalSpeed * delta;

      const result = resolveCapsuleMotion(collisionWorld, capsule, frameDelta);
      playerRig.position.add(result.displacement);
      if (result.grounded && verticalSpeed < 0) verticalSpeed = 0;
    },
    setSpeed(value) {
      if (Number.isFinite(value)) walkSpeed = Math.min(3, Math.max(0.5, value));
    },
    reset() {
      verticalSpeed = 0;
    },
  };
}
