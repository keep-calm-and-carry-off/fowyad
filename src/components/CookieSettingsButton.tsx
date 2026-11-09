"use client";

import Link from "@mui/material/Link";
import { CONSENT_EVENT } from "@/lib/consent";

export function CookieSettingsButton() {
  return (
    <Link
      component="button"
      type="button"
      color="text.secondary"
      underline="hover"
      onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}
      sx={{ font: "inherit", cursor: "pointer", verticalAlign: "baseline" }}
    >
      Настройки cookie
    </Link>
  );
}
