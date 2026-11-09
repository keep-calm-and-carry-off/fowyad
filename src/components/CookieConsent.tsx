"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useSyncExternalStore } from "react";
import { CONSENT_EVENT, readConsent, writeConsent, type ConsentChoice } from "@/lib/consent";

const listeners = new Set<() => void>();
let reopen = false;

function dialogOpen() {
  return reopen || readConsent() === null;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const show = () => {
    reopen = true;
    emit();
  };
  window.addEventListener(CONSENT_EVENT, show);
  return () => {
    listeners.delete(listener);
    window.removeEventListener(CONSENT_EVENT, show);
  };
}

export function CookieConsent() {
  const open = useSyncExternalStore(subscribe, dialogOpen, () => false);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    writeConsent(choice);
    reopen = false;
    emit();
  };

  return (
    <Box
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      sx={{
        position: "fixed",
        zIndex: (theme) => theme.zIndex.snackbar,
        left: 16,
        right: 16,
        bottom: 16,
        mx: "auto",
        width: "min(720px, calc(100% - 32px))",
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: "0 16px 50px rgba(0,0,0,0.45)",
      }}
    >
      <Typography id="cookie-title" sx={{ fontWeight: 700 }}>
        Cookie и данные на этом сайте
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Форм и счётчиков аналитики нет. В браузере сохраняется только ваш выбор по этой панели: он остаётся на устройстве и на сервер не отправляется. Рекламные cookie не используются. Текст согласия отдельный, его можно отозвать внизу страницы.
      </Typography>
      <Link component={NextLink} href="/privacy" underline="hover" sx={{ display: "inline-block", mt: 1.5 }}>
        Политика использования персональных данных
      </Link>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => choose("all")}>
          Принять
        </Button>
      </Box>
    </Box>
  );
}
