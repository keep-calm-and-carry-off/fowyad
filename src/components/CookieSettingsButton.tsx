"use client";

import Link from "@mui/material/Link";
import { CONSENT_EVENT } from "@/lib/consent";

export function CookieSettingsButton() {
  return (
    <Link
      component="button"
      type="button"
      color="text.primary"
      underline="hover"
      onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}
      sx={{
        alignSelf: "flex-start",
        p: 0,
        border: 0,
        font: "inherit",
        fontSize: "0.95rem",
        lineHeight: 1.5,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      Настройки cookie
    </Link>
  );
}
