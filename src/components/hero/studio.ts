import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type StudioResources = {
  resizeObserver: ResizeObserver | null;
  environment: THREE.Texture | null;
  pmrem: THREE.PMREMGenerator | null;
};

export function emptyStudio(): StudioResources {
  return { resizeObserver: null, environment: null, pmrem: null };
}

export function disposeStudio(studio: StudioResources) {
  studio.resizeObserver?.disconnect();
  studio.environment?.dispose();
  studio.pmrem?.dispose();
}

function fitDrawingBuffer(gl: THREE.WebGLRenderer, setSize: (width: number, height: number) => void) {
  const parent = gl.domElement.parentElement;
  if (!parent) return;
  const width = parent.clientWidth;
  const height = parent.clientHeight;
  if (width < 2 || height < 2) return;
  setSize(width, height);
  gl.domElement.style.width = "100%";
  gl.domElement.style.height = "100%";
}

export function mountStudio(
  gl: THREE.WebGLRenderer,
  scene: THREE.Scene,
  setSize: (width: number, height: number) => void,
  studio: StudioResources,
) {
  gl.shadowMap.enabled = false;
  gl.toneMappingExposure = 1.12;
  gl.outputColorSpace = THREE.SRGBColorSpace;
  scene.background = new THREE.Color("#070708");
  scene.fog = new THREE.Fog("#070708", 13, 30);
  const pmrem = new THREE.PMREMGenerator(gl);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  studio.environment = environment;
  studio.pmrem = pmrem;

  const parent = gl.domElement.parentElement;
  fitDrawingBuffer(gl, setSize);
  if (!parent) return;
  studio.resizeObserver?.disconnect();
  studio.resizeObserver = new ResizeObserver(() => fitDrawingBuffer(gl, setSize));
  studio.resizeObserver.observe(parent);
}
