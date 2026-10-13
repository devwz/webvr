import assert from 'node:assert/strict';
import test from 'node:test';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { createPlayerCapsule, createCollisionWorld, resolveCapsuleMotion } from '../src/collisions.js';
import { getPlanarMovement, readThumbstick } from '../src/locomotion.js';

function createBox(position, size) {
  const mesh = new Mesh(new BoxGeometry(...size), new MeshBasicMaterial());
  mesh.position.set(...position);
  return mesh;
}

test('capsule motion stops at a wall and continues along its plane', () => {
  const model = new Group();
  model.add(createBox([1, 1.5, 0], [0.1, 3, 8]));
  const world = createCollisionWorld(model);
  const capsule = createPlayerCapsule();
  capsule.start.set(0, 0.35, 0);
  capsule.end.set(0, 1.25, 0);

  const result = resolveCapsuleMotion(world, capsule, new Vector3(2, 0, 0));

  assert.equal(result.collided, true);
  assert.ok(capsule.getCenter(new Vector3()).x < 0.7);
  assert.ok(capsule.getCenter(new Vector3()).x > 0.5);
});

test('capsule motion resolves downward movement against the floor', () => {
  const model = new Group();
  model.add(createBox([0, -0.05, 0], [10, 0.1, 10]));
  const world = createCollisionWorld(model);
  const capsule = createPlayerCapsule();
  capsule.start.set(0, 0.32, 0);
  capsule.end.set(0, 1.22, 0);

  const result = resolveCapsuleMotion(world, capsule, new Vector3(0, -0.2, 0));

  assert.equal(result.collided, true);
  assert.equal(result.grounded, true);
  assert.ok(Math.abs(result.displacement.y) < 0.01);
});

test('thumbstick reads the left controller and applies a radial deadzone', () => {
  const axes = readThumbstick([
    { handedness: 'right', gamepad: { axes: [0.8, 0, 0, 0] } },
    { handedness: 'left', gamepad: { axes: [0, 0, 0.5, -1] } },
  ]);

  assert.ok(axes.x > 0);
  assert.ok(axes.y < 0);
  assert.ok(Math.hypot(axes.x, axes.y) <= 1);
  assert.deepEqual(readThumbstick([{ handedness: 'left', gamepad: { axes: [0, 0, 0.1, 0] } }]), { x: 0, y: 0 });
  assert.deepEqual(readThumbstick([{ handedness: 'right', gamepad: { axes: [0, 0, 1, 0] } }]), { x: 0, y: 0 });
});

test('movement follows horizontal camera yaw and normalizes diagonals', () => {
  const forward = getPlanarMovement(new Vector3(1, 0.8, 0), { x: 0, y: -1 });
  assert.ok(forward.distanceTo(new Vector3(1, 0, 0)) < 1e-8);

  const diagonal = getPlanarMovement(new Vector3(0, 0, -1), { x: 1, y: -1 });
  assert.ok(Math.abs(diagonal.length() - 1) < 1e-8);
});
