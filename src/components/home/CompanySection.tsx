import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { companyFacts } from "@/content/home";
import { FACTORY_URL } from "@/lib/config";
import { ActionRow, AvitoButton, FactStack, Section, ShopButton } from "./primitives";

export function CompanySection() {
  return (
    <Section id="company">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
          gap: { xs: 4, md: 8 },
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 3, md: 6 },
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ letterSpacing: "0.22em", color: "text.secondary" }}>
            Zhenjiang Fowyad Auto Parts
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "1.8rem", md: "2.6rem" }, mt: 1.5 }}>
            Оптика и кузовные детали для Opel
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.7, maxWidth: 520 }}>
            Для Opel есть фары, стёкла, фонари, бамперы, решётки и пластик. Завод — Zhenjiang Fowyad Auto Parts Co., Ltd. В России розница — на Ozon и на Авито, оптовые заказы принимает Евгений в Москве.
          </Typography>
          <ActionRow sx={{ mt: 3.5 }}>
            <ShopButton>Купить на Ozon</ShopButton>
            <AvitoButton>Купить на Авито</AvitoButton>
            <Button href={FACTORY_URL} target="_blank" rel="noreferrer" variant="outlined" color="inherit">
              Сайт завода
            </Button>
          </ActionRow>
        </Box>
        <FactStack items={companyFacts} sx={{ alignSelf: "end" }} />
      </Box>
    </Section>
  );
}
