import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { models } from "@/content/home";
import { displayFont, Lead, Section, SectionHead, ShopButton } from "./primitives";

export function ModelsSection() {
  return (
    <Section id="models">
      <SectionHead kicker="02" title="Opel и Vauxhall" />
      <Lead>Для этих моделей Opel есть оптика и кузовные детали.</Lead>
      <Box
        sx={{
          mt: 5,
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          columnGap: { md: 4 },
          rowGap: { xs: 0, md: 5 },
        }}
      >
        {models.map((model, index) => (
          <Box
            key={model.name}
            sx={{
              py: { xs: 2.5, md: 0 },
              minWidth: 0,
              borderTop: { xs: index < 2 ? "none" : "1px solid", md: index < 4 ? "none" : "1px solid" },
              borderColor: "divider",
            }}
          >
            <Typography color="text.secondary" sx={{ fontFamily: displayFont, fontSize: "0.75rem", letterSpacing: "0.16em" }}>
              0{index + 1}
            </Typography>
            <Typography
              sx={{
                fontFamily: displayFont,
                fontSize: { xs: "1.35rem", md: "1.85rem" },
                mt: 1,
                letterSpacing: "-0.04em",
                overflowWrap: "break-word",
              }}
            >
              {model.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 300, lineHeight: 1.7 }}>
              {model.text}
            </Typography>
          </Box>
        ))}
      </Box>
      <ShopButton sx={{ mt: 5 }}>Купить для своей модели</ShopButton>
    </Section>
  );
}
