import * as THREE from "three";
import { LIVERY_VERSION, placeLivery, type LiveryMaps } from "./livery";
import { visibleBounds, type CarDims } from "./model-bounds";

function tuneMaterial(material: THREE.Material) {
  const mat = material as THREE.MeshStandardMaterial;
  if (!mat.isMeshStandardMaterial) return;
  const name = mat.name.toLowerCase();
  mat.envMapIntensity = 1.2;
  if (/glass|wind/.test(name)) return;
  if (/rubber|gum/.test(name)) {
    mat.metalness = 0;
    mat.roughness = Math.max(mat.roughness, 0.72);
    return;
  }
  if (/chrome|aluminum/.test(name)) {
    mat.metalness = 1;
    mat.roughness = Math.min(mat.roughness, 0.16);
    mat.envMapIntensity = 1.45;
    return;
  }
  if (/bodypaint|paint/.test(name)) {
    mat.metalness = Math.max(mat.metalness, 0.5);
    mat.roughness = Math.min(Math.max(mat.roughness, 0.18), 0.34);
  }
}

function tuneMeshes(model: THREE.Object3D) {
  model.traverse((child) => {
    if (child.name === "base") {
      child.visible = false;
      child.traverse((nested) => {
        nested.visible = false;
      });
    }
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const tuned = materials.filter((item): item is THREE.Material => Boolean(item)).map((item) => {
      const copy = item.clone();
      tuneMaterial(copy);
      return copy;
    });
    mesh.material = tuned.length === 1 ? tuned[0] : tuned;
  });
}

function dropOversized(model: THREE.Object3D) {
  const drop: THREE.Object3D[] = [];
  model.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    const bounds = mesh.geometry.boundingBox;
    if (!bounds) return;
    const span = Math.max(bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y, bounds.max.z - bounds.min.z);
    if (span > 900) drop.push(mesh);
  });
  drop.forEach((mesh) => mesh.removeFromParent());
}

function fitOnGround(model: THREE.Object3D): CarDims {
  const box = visibleBounds(model);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  model.scale.setScalar(4.2 / maxDim);
  model.updateWorldMatrix(true, true);

  const fitted = visibleBounds(model);
  const fittedSize = fitted.getSize(new THREE.Vector3());
  const center = fitted.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= fitted.min.y;

  const isLengthX = fittedSize.x >= fittedSize.z;
  return { length: isLengthX ? fittedSize.x : fittedSize.z, height: fittedSize.y, isLengthX };
}

export function buildCar(source: THREE.Object3D, maps: LiveryMaps) {
  const model = source.clone(true);
  tuneMeshes(model);
  dropOversized(model);
  model.userData.dims = fitOnGround(model);
  model.updateWorldMatrix(true, true);
  placeLivery(model, maps);
  model.userData.livery = LIVERY_VERSION;
  return model;
}
