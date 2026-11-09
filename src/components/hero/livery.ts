import * as THREE from "three";
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";
import { visibleBounds } from "./model-bounds";

export const LIVERY_VERSION = 9;

export type LiveryMaps = {
  side: THREE.Texture;
  hood: THREE.Texture;
  rear: THREE.Texture;
  spray: THREE.Texture;
};

type Axis = "x" | "z";

function prepareMap(texture: THREE.Texture, mirror: boolean) {
  const map = texture.clone();
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.center.set(0.5, 0.5);
  if (mirror) map.repeat.x = -1;
  map.needsUpdate = true;
  return map;
}

function decalMaterial(texture: THREE.Texture) {
  return new THREE.MeshBasicMaterial({
    map: prepareMap(texture, false),
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -8,
    polygonOffsetUnits: -8,
    toneMapped: false,
  });
}

function projectorEuler(normal: THREE.Vector3, viewerRight: THREE.Vector3) {
  const z = normal.clone().normalize();
  const x = viewerRight.clone().addScaledVector(z, -viewerRight.dot(z));
  if (x.lengthSq() < 1e-6) return null;
  x.normalize();
  const y = new THREE.Vector3().crossVectors(z, x).normalize();
  return new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

function findBody(model: THREE.Object3D): THREE.Mesh | null {
  const meshes: THREE.Mesh[] = [];
  model.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (materials.some((item) => item?.name === "bodypaint")) meshes.push(mesh);
  });
  return meshes[0] ?? null;
}

function projectDecal(
  model: THREE.Object3D,
  painted: THREE.Mesh,
  raycaster: THREE.Raycaster,
  origin: THREE.Vector3,
  direction: THREE.Vector3,
  viewerRight: THREE.Vector3,
  decalSize: THREE.Vector3,
  texture: THREE.Texture,
) {
  raycaster.set(origin, direction.clone().normalize());
  const hit = raycaster.intersectObject(painted, false)[0];
  if (!hit?.face) return null;
  const normal = hit.face.normal.clone().transformDirection(painted.matrixWorld).normalize();
  const euler = projectorEuler(normal, viewerRight);
  if (!euler) return null;
  const geometry = new DecalGeometry(painted, hit.point, euler, decalSize);
  const position = geometry.getAttribute("position");
  if (!position || position.count < 6) {
    geometry.dispose();
    return null;
  }
  geometry.applyMatrix4(model.matrixWorld.clone().invert());
  const decal = new THREE.Mesh(geometry, decalMaterial(texture));
  decal.name = "fowyad-livery";
  decal.renderOrder = 2;
  model.add(decal);
  return normal;
}

function placeSideDecals(
  model: THREE.Object3D,
  painted: THREE.Mesh,
  raycaster: THREE.Raycaster,
  maps: LiveryMaps,
  frame: { box: THREE.Box3; size: THREE.Vector3; center: THREE.Vector3; sideAxis: Axis; lengthAxis: Axis; length: number; width: number; front: THREE.Vector3 },
) {
  const up = new THREE.Vector3(0, 1, 0);
  [1, -1].forEach((side) => {
    const outward = new THREE.Vector3();
    outward[frame.sideAxis] = side;
    const origin = frame.center.clone();
    origin.y = frame.box.min.y + frame.size.y * 0.4;
    origin[frame.sideAxis] = frame.center[frame.sideAxis] + side * (frame.width / 2 + 1.2);
    const viewerRight = new THREE.Vector3().crossVectors(up, outward);
    const logoSize = new THREE.Vector3(frame.length * 0.42, frame.length * 0.42 * (760 / 1800), 0.34);
    projectDecal(model, painted, raycaster, origin, outward.clone().negate(), viewerRight, logoSize, maps.side);

    [0.18, -0.3].forEach((along) => {
      const splashOrigin = frame.center.clone();
      splashOrigin.y = frame.box.min.y + frame.size.y * 0.42;
      splashOrigin[frame.sideAxis] = frame.center[frame.sideAxis] + side * (frame.width / 2 + 1.2);
      splashOrigin[frame.lengthAxis] = frame.center[frame.lengthAxis] + frame.front[frame.lengthAxis] * along * frame.length;
      projectDecal(model, painted, raycaster, splashOrigin, outward.clone().negate(), viewerRight, new THREE.Vector3(0.5, 0.5, 0.12), maps.spray);
    });
  });
}

export function placeLivery(model: THREE.Object3D, maps: LiveryMaps) {
  const painted = findBody(model);
  if (!painted) return;

  model.updateWorldMatrix(true, true);
  const box = visibleBounds(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const sideAxis: Axis = size.x >= size.z ? "z" : "x";
  const lengthAxis: Axis = sideAxis === "x" ? "z" : "x";
  const length = Math.max(size.x, size.z);
  const width = Math.min(size.x, size.z);
  const front = new THREE.Vector3();
  front[lengthAxis] = 1;
  const rightFromFront = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), front).normalize();
  const raycaster = new THREE.Raycaster();
  const frame = { box, size, center, sideAxis, lengthAxis, length, width, front };

  placeSideDecals(model, painted, raycaster, maps, frame);

  const hoodSize = new THREE.Vector3(width * 0.7, width * 0.7 * (900 / 1500), 0.16);
  const down = new THREE.Vector3(0, -1, 0);
  for (const along of [0.34, 0.3, 0.26]) {
    const hoodOrigin = center.clone();
    hoodOrigin.y = box.max.y + 1.6;
    hoodOrigin[lengthAxis] = center[lengthAxis] + front[lengthAxis] * length * along;
    raycaster.set(hoodOrigin, down);
    const hit = raycaster.intersectObject(painted, false)[0];
    if (!hit?.face) continue;
    const normal = hit.face.normal.clone().transformDirection(painted.matrixWorld).normalize();
    if (normal.y < 0.72) continue;
    projectDecal(model, painted, raycaster, hoodOrigin, down, rightFromFront, hoodSize, maps.hood);
    break;
  }

  const rearSize = new THREE.Vector3(width * 0.36, width * 0.36 * (500 / 1700), 0.08);
  const backward = front.clone().negate();
  for (const height of [0.54, 0.5, 0.58]) {
    const rearOrigin = center.clone();
    rearOrigin.y = box.min.y + size.y * height;
    rearOrigin[lengthAxis] = center[lengthAxis] + backward[lengthAxis] * (length / 2 + 1.3);
    raycaster.set(rearOrigin, front.clone());
    const hit = raycaster.intersectObject(painted, false)[0];
    if (!hit?.face) continue;
    const normal = hit.face.normal.clone().transformDirection(painted.matrixWorld).normalize();
    if (normal.dot(backward) < 0.4 || normal.y > 0.78) continue;
    projectDecal(model, painted, raycaster, rearOrigin, front.clone(), rightFromFront.clone().negate(), rearSize, maps.rear);
    break;
  }
}
