import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { WHOLESALE } from "@/lib/config";
import { ActionRow, AvitoButton, displayFont, Section, SectionHead, ShopButton } from "./primitives";

const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(`${WHOLESALE.city}, ${WHOLESALE.street}`)}`;

const titleSx = {
  fontFamily: displayFont,
  fontSize: "1.2rem",
  borderTop: "1px solid",
  borderColor: "primary.main",
  pt: 2.5,
} as const;

export function ContactsSection() {
  return (
    <Section id="contacts">
      <SectionHead kicker="05" title="Где купить" />
      <Box
        sx={{
          mt: 5,
          display: "grid",
          columnGap: { md: 4 },
          rowGap: { xs: 1.5, md: 0 },
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gridTemplateAreas: {
            xs: `"retailTitle" "retailText" "retailActions" "wholesaleTitle" "wholesaleText" "wholesaleActions" "address" "legal"`,
            md: `"retailTitle wholesaleTitle" "retailText wholesaleText" "retailActions wholesaleActions" ". address" "legal legal"`,
          },
        }}
      >
        <Typography sx={{ ...titleSx, gridArea: "retailTitle" }}>Розница</Typography>
        <Typography color="text.secondary" sx={{ gridArea: "retailText", mt: 1.25, lineHeight: 1.7, maxWidth: 460 }}>
          Линейка FOWYAD на Ozon и на Авито. Доставка, оплата и возврат — по правилам площадки.
        </Typography>
        <ActionRow sx={{ gridArea: "retailActions", pt: 3 }}>
          <ShopButton>Купить на Ozon</ShopButton>
          <AvitoButton>Купить на Авито</AvitoButton>
        </ActionRow>

        <Typography sx={{ ...titleSx, gridArea: "wholesaleTitle", mt: { xs: 3, md: 0 } }}>Оптовые заказы</Typography>
        <Typography color="text.secondary" sx={{ gridArea: "wholesaleText", mt: 1.25, lineHeight: 1.7, maxWidth: 460 }}>
          {WHOLESALE.person} принимает заказы в Москве, {WHOLESALE.hoursLabel}.
        </Typography>
        <ActionRow sx={{ gridArea: "wholesaleActions", pt: 3 }}>
          <Button href={`tel:${WHOLESALE.phone}`} variant="outlined" color="inherit">
            {WHOLESALE.phoneLabel}
          </Button>
          <Button href={`mailto:${WHOLESALE.email}`} variant="outlined" color="inherit">
            {WHOLESALE.email}
          </Button>
        </ActionRow>
        <Link
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          underline="always"
          color="text.primary"
          sx={{
            gridArea: "address",
            mt: { xs: 0.5, md: 2 },
            justifySelf: "start",
            textUnderlineOffset: "0.22em",
            "&:hover": { color: "primary.main" },
          }}
        >
          {WHOLESALE.postalCode}, {WHOLESALE.city}, {WHOLESALE.street}
        </Link>
        <Typography variant="body2" color="text.secondary" sx={{ gridArea: "legal", mt: { xs: 3, md: 4 }, lineHeight: 1.7 }}>
          {WHOLESALE.legalName} · ИНН {WHOLESALE.inn} · ОГРНИП {WHOLESALE.ogrnip}
        </Typography>
      </Box>
    </Section>
  );
}
