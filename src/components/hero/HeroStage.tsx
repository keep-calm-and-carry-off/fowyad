"use client";

import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";

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
        <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "4px solid rgba(255, 59, 48, 0.2)",
              borderTopColor: "#ff3b30",
              boxShadow: "0 0 28px rgba(255, 59, 48, 0.35)",
              animation: reduced ? "none" : "fowyad-spin 0.75s linear infinite",
              "@keyframes fowyad-spin": {
                to: { transform: "rotate(360deg)" },
              },
            }}
          />
        </Box>
      )}
      {show ? <HeroCanvas reduced={reduced} onReady={() => setLive(true)} /> : null}
    </Box>
  );
}
