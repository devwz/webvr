import { Vector3 } from 'three';
import { Capsule } from 'three/addons/math/Capsule.js';
import { Octree } from 'three/addons/math/Octree.js';

const COLLISION_SKIN = 0.001;
const MAX_COLLISION_PASSES = 4;
const MAX_SUBSTEPS = 16;

export function createCollisionWorld(model) {
  return new Octree().fromGraphNode(model);
}

export function resolveCapsuleMotion(world, capsule, desiredDelta) {
  const start = capsule.getCenter(new Vector3());
  const distance = desiredDelta.length();
  const stepLength = Math.max(capsule.radius * 0.5, 0.08);
  const steps = Math.min(MAX_SUBSTEPS, Math.max(1, Math.ceil(distance / stepLength)));
  const step = desiredDelta.clone().multiplyScalar(1 / steps);
  let collided = false;
  let grounded = false;

  for (let index = 0; index < steps; index += 1) {
    capsule.translate(step);

    for (let pass = 0; pass < MAX_COLLISION_PASSES; pass += 1) {
      const hit = world.capsuleIntersect(capsule);
      if (!hit) break;

      collided = true;
      if (hit.normal.y > 0.55 && step.y <= 0) grounded = true;
      capsule.translate(hit.normal.multiplyScalar(hit.depth + COLLISION_SKIN));
    }
  }

  return {
    displacement: capsule.getCenter(new Vector3()).sub(start),
    collided,
    grounded,
  };
}

export function createPlayerCapsule(radius = 0.32) {
  return new Capsule(new Vector3(), new Vector3(), radius);
}
