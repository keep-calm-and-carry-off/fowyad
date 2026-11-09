"use client";

import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { asset } from "@/lib/base-path";

const HeroCanvas = dynamic(() => import("./HeroCanvas").then((mod) => mod.HeroCanvas), { ssr: false });
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(listener: () => void) {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function reducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export function HeroStage() {
  const reduced = useSyncExternalStore(subscribeReducedMotion, reducedMotion, () => false);
  const [show, setShow] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const start = () => setShow(true);
    const timer = window.setTimeout(start, 8000);
    const events = ["pointerdown", "touchstart", "wheel", "keydown"] as const;
    events.forEach((name) => window.addEventListener(name, start, { once: true, passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, start));
    };
  }, []);

  return (
    <Box
      aria-hidden
      sx={{
        position: { xs: "relative", md: "absolute" },
        top: { md: 64 },
        left: 0,
        right: 0,
        height: { xs: 280, md: "44%" },
        backgroundColor: "#070708",
      }}
    >
      {live ? null : (
        <Box
          component="img"
          src={asset("/hero-stage.webp")}
          alt=""
          width={1440}
          height={396}
          fetchPriority="high"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      )}
      {show ? <HeroCanvas reduced={reduced} onReady={() => setLive(true)} /> : null}
    </Box>
  );
}
