"use client";

import { useGLTF } from "@react-three/drei";
import { asset } from "@/lib/base-path";

export const MODEL_URL = `${asset("/models/astra.glb")}?v=6`;
export const DRACO_PATH = asset("/draco/");

const mark = "v=13";

export const BADGE_URL = `${asset("/badge.png")}?${mark}`;

export const liveryTextures = [
  `${asset("/livery-side.webp")}?${mark}`,
  `${asset("/livery-hood.webp")}?${mark}`,
  `${asset("/livery-rear.webp")}?${mark}`,
  `${asset("/livery-spray.webp")}?${mark}`,
] as const;

useGLTF.preload(MODEL_URL, DRACO_PATH, false);
