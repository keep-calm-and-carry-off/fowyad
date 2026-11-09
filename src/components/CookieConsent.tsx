"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useSyncExternalStore } from "react";
import { chooseConsent, dialogOpen, subscribeConsent, type ConsentChoice } from "@/lib/consent";

export function CookieConsent() {
  const open = useSyncExternalStore(subscribeConsent, dialogOpen, () => false);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => chooseConsent(choice);

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
        «Принять» разрешает Яндекс Метрику: cookie счётчика, карту кликов, вебвизор и учёт переходов. Эти сведения обрабатывает ООО «ЯНДЕКС». «Только необходимые» оставляет в браузере лишь запись об этом выборе, счётчик не подключается. Рекламные cookie не используются. Согласие можно изменить внизу страницы.
      </Typography>
      <Link component={NextLink} href="/privacy" underline="hover" sx={{ display: "inline-block", mt: 1.5 }}>
        Политика использования персональных данных
      </Link>
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        <Button variant="contained" onClick={() => choose("all")}>
          Принять
        </Button>
        <Button variant="outlined" color="inherit" onClick={() => choose("necessary")}>
          Только необходимые
        </Button>
      </Box>
    </Box>
  );
}
