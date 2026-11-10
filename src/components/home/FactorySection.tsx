import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { factoryFacts } from "@/content/home";
import { FACTORY_URL } from "@/lib/config";
import { ActionRow, AvitoButton, FactStack, Lead, Section, SectionHead, ShopButton } from "./primitives";

export function FactorySection() {
  return (
    <Section id="factory">
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" }, gap: { xs: 4, md: 8 }, alignItems: "end" }}>
        <Box>
          <SectionHead kicker="03" title="Завод" />
          <Lead maxWidth={520}>
            Zhenjiang Fowyad Auto Parts выпускает оптику и кузовные детали одной марки. Для Opel это фары, решётки, бамперы и пластик.
          </Lead>
          <ActionRow sx={{ mt: 3.5 }}>
            <ShopButton>Купить на Ozon</ShopButton>
            <AvitoButton>Купить на Авито</AvitoButton>
            <Button href={FACTORY_URL} target="_blank" rel="noreferrer" variant="outlined" color="inherit">
              Сайт завода
            </Button>
          </ActionRow>
        </Box>
        <FactStack items={factoryFacts} />
      </Box>
    </Section>
  );
}
