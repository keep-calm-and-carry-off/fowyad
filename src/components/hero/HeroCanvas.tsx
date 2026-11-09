"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { CarView } from "./CarView";
import { disposeStudio, emptyStudio, mountStudio } from "./studio";

export function HeroCanvas({ reduced = false, onReady }: { reduced?: boolean; onReady?: () => void }) {
  const studio = useRef(emptyStudio());

  useEffect(() => () => disposeStudio(studio.current), []);

  return (
    <Canvas
      camera={{ position: [5.5, 1.8, 6.5], fov: 34, near: 0.1, far: 80 }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%", display: "block" }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl, scene, setSize }) => mountStudio(gl, scene, setSize, studio.current)}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 10, 6]} intensity={2.3} />
      <directionalLight position={[-6, 4.5, -7]} intensity={1.8} color="#ff3b30" />
      <directionalLight position={[5, 2.5, -5]} intensity={0.7} color="#6d84ff" />
      <Suspense fallback={null}>
        <CarView reduced={reduced} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
