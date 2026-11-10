"use client";

import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three/addons/controls/OrbitControls.js";
import { BADGE_URL, DRACO_PATH, liveryTextures, MODEL_URL } from "./assets";
import { buildCar } from "./build-car";
import { collectWheels, type CarDims } from "./model-bounds";

function frameCamera(camera: THREE.Camera, controls: OrbitControlsImpl | null, dims: CarDims) {
  const distance = dims.length * 1.22;
  camera.position.set(distance * 0.9, dims.height * 0.72, distance * 0.82);
  const look = new THREE.Vector3(0, dims.height * 0.42, 0);
  camera.lookAt(look);
  if (!controls) return;
  controls.target.copy(look);
  controls.minDistance = dims.length * 0.95;
  controls.maxDistance = dims.length * 3.4;
  controls.update();
}

export function CarView({ reduced, onReady }: { reduced: boolean; onReady?: () => void }) {
  const gltf = useGLTF(MODEL_URL, DRACO_PATH, false);
  const [sideMap, hoodMap, rearMap, sprayMap, badgeMap] = useTexture([...liveryTextures, BADGE_URL]);
  const model = useMemo(
    () => buildCar(gltf.scene, { side: sideMap, hood: hoodMap, rear: rearMap, spray: sprayMap }, badgeMap),
    [gltf.scene, sideMap, hoodMap, rearMap, sprayMap, badgeMap],
  );
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Object3D[]>([]);
  const controls = useRef<OrbitControlsImpl>(null);
  const neonL = useRef<THREE.PointLight>(null);
  const neonR = useRef<THREE.PointLight>(null);
  const camera = useThree((state) => state.camera);

  useLayoutEffect(() => {
    wheels.current = collectWheels(model);
    frameCamera(camera, controls.current, model.userData.dims as CarDims);
    onReady?.();
  }, [camera, model, onReady]);

  useFrame(({ clock }, delta) => {
    if (reduced) return;
    const time = clock.elapsedTime;
    const step = Math.min(delta, 0.05);
    wheels.current.forEach((wheel) => wheel.rotateX(7 * step));
    const node = group.current;
    if (!node) return;
    node.position.y = Math.sin(time * 1.7) * 0.018;
    node.rotation.z = Math.sin(time * 1.3) * 0.01;
    if (neonL.current) neonL.current.intensity = 8 + Math.sin(time * 2.4) * 2.5;
    if (neonR.current) neonR.current.intensity = 6 + Math.cos(time * 2.1) * 2;
  });

  return (
    <>
      <group ref={group}>
        <primitive object={model} />
      </group>
      <OrbitControls
        ref={controls as never}
        enableDamping
        dampingFactor={0.08}
        autoRotate={!reduced}
        autoRotateSpeed={0.7}
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2 - 0.08}
        minPolarAngle={0.5}
      />
      <pointLight ref={neonL} color="#ff3b30" intensity={8} distance={7} position={[-2.2, 0.7, 1.6]} />
      <pointLight ref={neonR} color="#ff3b30" intensity={6} distance={6.5} position={[2.2, 0.65, -1.4]} />
    </>
  );
}
