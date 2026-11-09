"use client";

import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { useState } from "react";
import { asset } from "@/lib/base-path";

const LINKS = [
  { href: "/#range", label: "Линейка" },
  { href: "/#models", label: "Модели" },
  { href: "/#buy", label: "Купить" },
  { href: "/#faq", label: "Вопросы" },
  { href: "/#company", label: "О компании" },
];

export function Header({ shopUrl }: { shopUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(7,7,8,0.78)",
          backdropFilter: "blur(22px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar sx={{ minHeight: 76, gap: 1, px: { xs: 2, md: 4 } }}>
          <Box component={Link} href="/" sx={{ display: "flex", mr: "auto", flexShrink: 0 }}>
            <Box component="img" src={asset("/logo.webp")} alt="FOWYAD" width={398} height={96} sx={{ height: 48, width: "auto" }} />
          </Box>
          <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
            {LINKS.map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                color="inherit"
                sx={{ color: "text.secondary", minHeight: 36, px: 1.25, fontWeight: 500, fontSize: "0.92rem" }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
          <Button
            href={shopUrl}
            target="_blank"
            rel="noreferrer"
            variant="contained"
            sx={{ display: { xs: "none", md: "inline-flex" } }}
          >
            Купить FOWYAD
          </Button>
          <IconButton
            color="inherit"
            aria-label="Открыть меню"
            onClick={() => setOpen(true)}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: 280, p: 2 } } }}
      >
        <Stack spacing={1} sx={{ mt: 2 }}>
          {LINKS.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              onClick={() => setOpen(false)}
              color="inherit"
              sx={{ justifyContent: "flex-start" }}
            >
              {link.label}
            </Button>
          ))}
          <Button href={shopUrl} target="_blank" rel="noreferrer" variant="contained">
            Купить FOWYAD
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
