import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { asset } from "@/lib/base-path";
import { AVITO_SHOP_URL, FACTORY_URL, OZON_SHOP_URL, WHOLESALE } from "@/lib/config";

const LINKS = [
  { href: "/#range", label: "Линейка" },
  { href: "/#models", label: "Модели" },
  { href: "/#contacts", label: "Контакты" },
  { href: "/#faq", label: "Вопросы" },
  { href: "/#company", label: "О компании" },
  { href: "/consent", label: "Согласие" },
  { href: "/privacy", label: "Персональные данные" },
];

const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(`${WHOLESALE.city}, ${WHOLESALE.street}`)}`;

const MODEL_PAGE = "https://sketchfab.com/3d-models/opel-astra-gtc-2012-d76ad5a0495443eda24a9052565ef9a8";
const MODEL_AUTHOR = "https://sketchfab.com/comrade1280";
const MODEL_LICENSE = "https://creativecommons.org/licenses/by/4.0/deed.ru";

export function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", mt: "auto" }}>
      <Box sx={{ width: "min(1120px, calc(100% - 48px))", mx: "auto", py: { xs: 5, md: 7 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 4, md: 8 }} sx={{ justifyContent: "space-between" }}>
          <Box component="address" sx={{ maxWidth: 420, fontStyle: "normal" }}>
            <Box component="img" src={asset("/logo.svg")} alt="FOWYAD" width={3520} height={910} sx={{ height: 40, width: "auto" }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
              Розница FOWYAD — на Ozon и на Авито. Оптовые заказы принимает {WHOLESALE.person}, {WHOLESALE.hoursLabel}.
            </Typography>
            <Stack spacing={0.75} sx={{ mt: 2 }}>
              <Link href={`tel:${WHOLESALE.phone}`} color="text.primary" underline="hover">
                {WHOLESALE.phoneLabel}
              </Link>
              <Link href={`mailto:${WHOLESALE.email}`} color="text.primary" underline="hover">
                {WHOLESALE.email}
              </Link>
              <Link href={mapUrl} target="_blank" rel="noreferrer" color="text.primary" underline="hover">
                {WHOLESALE.postalCode}, {WHOLESALE.city}, {WHOLESALE.street}
              </Link>
            </Stack>
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
                Розница
              </Typography>
              <Link href={OZON_SHOP_URL} target="_blank" rel="noreferrer" color="text.primary" underline="hover">
                FOWYAD на Ozon
              </Link>
              <Link href={AVITO_SHOP_URL} target="_blank" rel="noreferrer" color="text.primary" underline="hover">
                FOWYAD на Авито
              </Link>
              <Link href={FACTORY_URL} target="_blank" rel="noreferrer" color="text.primary" underline="hover">
                Завод FOWYAD
              </Link>
            </Stack>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 6, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
          {WHOLESALE.legalName} · ИНН {WHOLESALE.inn} · ОГРНИП {WHOLESALE.ogrnip} · оптика и кузовные детали FOWYAD для Opel и Vauxhall
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, fontSize: "0.8rem", lineHeight: 1.6 }}>
          Модель на первом экране основана на{" "}
          <Link href={MODEL_PAGE} target="_blank" rel="noreferrer" color="inherit" underline="always">
            Opel Astra GTC 2012
          </Link>{" "}
          автора{" "}
          <Link href={MODEL_AUTHOR} target="_blank" rel="noreferrer" color="inherit" underline="always">
            Comrade1280
          </Link>
          . Лицензия{" "}
          <Link href={MODEL_LICENSE} target="_blank" rel="noreferrer" color="inherit" underline="always">
            CC BY 4.0
          </Link>
          . Окраска, знаки и надписи изменены.
        </Typography>
      </Box>
    </Box>
  );
}
