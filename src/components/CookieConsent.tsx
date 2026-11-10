"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useSyncExternalStore } from "react";
import { chooseConsent, dialogOpen, subscribeConsent } from "@/lib/consent";

export function CookieConsent() {
  const open = useSyncExternalStore(subscribeConsent, dialogOpen, () => false);

  if (!open) return null;

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
        Мы используем файлы cookie
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Они запоминают ваш выбор и, если вы согласитесь, помогают считать посещения. Нажимая «Принять», вы соглашаетесь на cookie и на обработку персональных данных. Подробнее — в{" "}
        <Link component={NextLink} href="/consent" underline="hover" color="inherit">
          политике использования файлов cookie
        </Link>
        .
      </Typography>
      <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => chooseConsent("all")}>
          Принять
        </Button>
        <Button variant="outlined" color="inherit" onClick={() => chooseConsent("necessary")}>
          Отклонить
        </Button>
      </Stack>
    </Box>
  );
}
