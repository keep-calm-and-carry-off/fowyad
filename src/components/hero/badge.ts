import * as THREE from "three";
import type { CarDims } from "./model-bounds";
import { visibleBounds } from "./model-bounds";

const AXES = ["x", "y", "z"] as const;

function badgeMaterial(texture: THREE.Texture) {
  const map = texture.clone();
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  map.needsUpdate = true;
  return new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    alphaTest: 0.2,
    depthWrite: true,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
    toneMapped: false,
  });
}

function addDisc(
  parent: THREE.Object3D,
  center: THREE.Vector3,
  normal: THREE.Vector3,
  diameter: number,
  material: THREE.Material,
) {
  const disc = new THREE.Mesh(new THREE.CircleGeometry(diameter / 2, 40), material);
  disc.name = "fowyad-badge";
  disc.renderOrder = 3;
  disc.position.copy(center);
  disc.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  parent.add(disc);
}

function emblemDiameter(width: number, height: number) {
  const shorter = Math.min(width, height);
  const longer = Math.max(width, height);
  return longer / shorter < 1.6 ? longer : shorter;
}

function replaceEmblem(model: THREE.Object3D, mesh: THREE.Mesh, material: THREE.Material, lengthAxis: "x" | "z", carCenter: THREE.Vector3) {
  if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
  const localBox = mesh.geometry.boundingBox;
  if (!localBox) return;
  const world = localBox.clone().applyMatrix4(mesh.matrixWorld);
  const worldSize = world.getSize(new THREE.Vector3());
  const center = world.getCenter(new THREE.Vector3());
  const scale = model.getWorldScale(new THREE.Vector3());
  const face = AXES.filter((axis) => axis !== lengthAxis).map((axis) => worldSize[axis] / scale[axis]);
  const outward = Math.sign(center[lengthAxis] - carCenter[lengthAxis]) || 1;
  const localCenter = model.worldToLocal(center);
  localCenter[lengthAxis] += outward * (worldSize[lengthAxis] / scale[lengthAxis] / 2 + 0.4);
  const normal = new THREE.Vector3();
  normal[lengthAxis] = outward;
  addDisc(model, localCenter, normal, emblemDiameter(face[0], face[1]), material);
  mesh.visible = false;
}

function findRim(wheel: THREE.Object3D): THREE.Mesh | null {
  let rim: THREE.Mesh | null = null;
  wheel.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    if (material?.name === "aluminum") rim = mesh;
  });
  return rim;
}

function placeWheelBadge(wheel: THREE.Object3D, material: THREE.Material, carCenter: THREE.Vector3) {
  const rim = findRim(wheel);
  if (!rim) return;
  if (!rim.geometry.boundingBox) rim.geometry.computeBoundingBox();
  const box = rim.geometry.boundingBox;
  const position = rim.geometry.attributes.position;
  if (!box || !position) return;

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const axle = AXES.reduce((thin, axis) => (size[axis] < size[thin] ? axis : thin));
  const faceAxes = AXES.filter((axis) => axis !== axle);
  const origin = new THREE.Vector3();
  const outwardTip = new THREE.Vector3();
  outwardTip[axle] = 1;
  wheel.localToWorld(origin);
  wheel.localToWorld(outwardTip);
  const wheelCenter = new THREE.Vector3();
  wheel.getWorldPosition(wheelCenter);
  const localOutward = Math.sign(outwardTip.sub(origin).dot(wheelCenter.sub(carCenter))) || 1;
  const hubRadius = Math.min(size[faceAxes[0]], size[faceAxes[1]]) * 0.07;
  const vertex = new THREE.Vector3();
  let face = localOutward > 0 ? -Infinity : Infinity;
  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index);
    const across = vertex[faceAxes[0]] - center[faceAxes[0]];
    const along = vertex[faceAxes[1]] - center[faceAxes[1]];
    if (across * across + along * along > hubRadius * hubRadius) continue;
    face = localOutward > 0 ? Math.max(face, vertex[axle]) : Math.min(face, vertex[axle]);
  }
  if (!Number.isFinite(face)) return;

  const cap = center.clone();
  cap[axle] = face + localOutward * 0.25;
  rim.localToWorld(cap);
  wheel.worldToLocal(cap);
  const normal = new THREE.Vector3();
  normal[axle] = localOutward;
  addDisc(wheel, cap, normal, hubRadius * 2.3, material);
}

export function placeBadges(model: THREE.Object3D, texture: THREE.Texture) {
  model.updateWorldMatrix(true, true);
  const lengthAxis: "x" | "z" = (model.userData.dims as CarDims).isLengthX ? "x" : "z";
  const carCenter = visibleBounds(model).getCenter(new THREE.Vector3());
  const material = badgeMaterial(texture);
  const emblems: THREE.Mesh[] = [];
  const wheels: THREE.Object3D[] = [];
  model.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && (mesh.parent?.name === "logo" || mesh.parent?.name === "logo001")) emblems.push(mesh);
    if (child.name.startsWith("Wheel_")) wheels.push(child);
  });
  emblems.forEach((mesh) => replaceEmblem(model, mesh, material, lengthAxis, carCenter));
  wheels.forEach((wheel) => placeWheelBadge(wheel, material, carCenter));
}
