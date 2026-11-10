import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { reasons } from "@/content/home";
import { ActionRow, AvitoButton, displayFont, Section, SectionHead, ShopButton } from "./primitives";

export function ReasonsSection() {
  return (
    <Section id="buy">
      <SectionHead kicker="04" title="Почему FOWYAD" />
      <Box sx={{ mt: 5, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: { xs: 4, md: 3 } }}>
        {reasons.map((step) => (
          <Box key={step.n} sx={{ borderTop: "1px solid", borderColor: "primary.main", pt: 2.5 }}>
            <Typography color="primary" sx={{ fontFamily: displayFont, letterSpacing: "0.12em" }}>
              {step.n}
            </Typography>
            <Typography sx={{ mt: 2, fontFamily: displayFont, fontSize: "1.2rem" }}>{step.title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1.25, lineHeight: 1.7 }}>
              {step.text}
            </Typography>
          </Box>
        ))}
      </Box>
      <ActionRow sx={{ mt: 5 }}>
        <ShopButton>Купить на Ozon</ShopButton>
        <AvitoButton>Купить на Авито</AvitoButton>
      </ActionRow>
    </Section>
  );
}
