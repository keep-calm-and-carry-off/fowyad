import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { HeroStage } from "@/components/hero/HeroStage";
import { heroStats } from "@/content/home";
import { ActionRow, AvitoButton, ShopButton, Stat } from "./primitives";

export function Hero() {
  return (
    <Box sx={{ position: "relative", minHeight: { md: "100vh" }, overflow: "hidden", backgroundColor: "#070708" }}>
      <HeroStage />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: { md: "100vh" },
          display: "flex",
          alignItems: "flex-end",
          pointerEvents: "none",
          backgroundColor: "transparent",
        }}
      >
        <Box sx={{ width: "min(1120px, calc(100% - 48px))", mx: "auto", pb: { xs: 5, md: 7 }, pt: 12 }}>
          <Box sx={{ pl: 2.5, borderLeft: "2px solid", borderColor: "primary.main" }}>
            <Typography variant="overline" sx={{ letterSpacing: "0.28em", color: "text.secondary" }}>
              FOWYAD · Россия
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: "2.2rem", md: "4.2rem" }, maxWidth: "14ch", mt: 1 }}>
              Фары и кузовные детали
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 440, mt: 2.5, fontSize: "1.08rem", lineHeight: 1.65 }}>
              С завода FOWYAD в Чжэньцзяне — на Opel. Представительство завода в Москве.
            </Typography>
            <ActionRow sx={{ mt: 3.5, pointerEvents: "auto" }}>
              <ShopButton>Купить на Ozon</ShopButton>
              <AvitoButton>Купить на Авито</AvitoButton>
              <Button href="#contacts" variant="outlined" color="inherit">
                Оптовый заказ
              </Button>
            </ActionRow>
          </Box>
          <Box
            sx={{
              mt: { xs: 5, md: 7 },
              pt: 3,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            {heroStats.map((item) => (
              <Stat key={item.value} value={item.value} label={item.label} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
