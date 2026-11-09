import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { factoryFacts } from "@/content/home";
import { FACTORY_URL } from "@/lib/config";
import { FactStack, Lead, Section, SectionHead, ShopButton } from "./primitives";

export function FactorySection() {
  return (
    <Section id="factory">
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" }, gap: { xs: 4, md: 8 }, alignItems: "end" }}>
        <Box>
          <SectionHead kicker="03" title="Завод" />
          <Lead maxWidth={520}>
            Zhenjiang Fowyad Auto Parts выпускает оптику и кузовные детали одной марки. Для Opel это фары, решётки, бамперы и пластик.
          </Lead>
          <Stack direction="row" spacing={1.5} sx={{ mt: 3.5, flexWrap: "wrap" }}>
            <ShopButton>Купить FOWYAD</ShopButton>
            <Button href={FACTORY_URL} target="_blank" rel="noreferrer" variant="outlined" color="inherit">
              Сайт завода
            </Button>
          </Stack>
        </Box>
        <FactStack items={factoryFacts} />
      </Box>
    </Section>
  );
}
