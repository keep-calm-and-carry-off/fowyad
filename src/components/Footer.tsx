import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { asset } from "@/lib/base-path";
import { FACTORY_URL } from "@/lib/config";

const LINKS = [
  { href: "/#range", label: "Линейка" },
  { href: "/#models", label: "Модели" },
  { href: "/#buy", label: "Купить" },
  { href: "/#faq", label: "Вопросы" },
  { href: "/#company", label: "О компании" },
  { href: "/privacy", label: "Персональные данные" },
];

export function Footer({ shopUrl }: { shopUrl: string }) {
  return (
    <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", mt: "auto" }}>
      <Box sx={{ width: "min(1120px, calc(100% - 48px))", mx: "auto", py: { xs: 5, md: 7 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 4, md: 8 }} sx={{ justifyContent: "space-between" }}>
          <Box sx={{ maxWidth: 420 }}>
            <Box component="img" src={asset("/logo.webp")} alt="FOWYAD" width={398} height={96} sx={{ height: 40, width: "auto" }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
              Для Opel — оптика и кузовные детали FOWYAD. Купить можно на нескольких площадках, включая Ozon.
            </Typography>
          </Box>
          <Stack direction="row" spacing={{ xs: 4, md: 8 }} sx={{ flexWrap: "wrap" }}>
            <Stack spacing={1.25}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.18em" }}>
                Сайт
              </Typography>
              {LINKS.map((link) => (
                <Link key={link.href} href={asset(link.href)} color="text.primary" underline="hover" sx={{ fontSize: "0.95rem" }}>
                  {link.label}
                </Link>
              ))}
              <CookieSettingsButton />
            </Stack>
            <Stack spacing={1.25}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.18em" }}>
                Площадки
              </Typography>
              <Link href={shopUrl} target="_blank" rel="noreferrer" color="text.primary" underline="hover">
                Купить FOWYAD
              </Link>
              <Link href={FACTORY_URL} target="_blank" rel="noreferrer" color="text.primary" underline="hover">
                Завод FOWYAD
              </Link>
            </Stack>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 6, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
          FOWYAD · оптика и кузовные детали для Opel и Vauxhall
        </Typography>
      </Box>
    </Box>
  );
}
