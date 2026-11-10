"use client";

import { useGLTF } from "@react-three/drei";
import { asset } from "@/lib/base-path";

export const MODEL_URL = `${asset("/models/astra.glb")}?v=6`;
export const DRACO_PATH = asset("/draco/");

export const BADGE_URL = asset("/badge.png");

export const liveryTextures = [
  asset("/livery-side.webp"),
  asset("/livery-hood.webp"),
  asset("/livery-rear.webp"),
  asset("/livery-spray.webp"),
] as const;

useGLTF.preload(MODEL_URL, DRACO_PATH, false);
