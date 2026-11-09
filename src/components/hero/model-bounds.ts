import * as THREE from "three";

export type CarDims = {
  length: number;
  height: number;
  isLengthX: boolean;
};

export function visibleBounds(root: THREE.Object3D) {
  const box = new THREE.Box3();
  root.updateWorldMatrix(true, true);
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.visible || !mesh.geometry) return;
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    const bounds = mesh.geometry.boundingBox;
    if (!bounds) return;
    box.union(bounds.clone().applyMatrix4(mesh.matrixWorld));
  });
  return box;
}

export function collectWheels(model: THREE.Object3D) {
  const wheels: THREE.Object3D[] = [];
  model.traverse((child) => {
    if (child.name.startsWith("Wheel_")) wheels.push(child);
  });
  return wheels;
}
