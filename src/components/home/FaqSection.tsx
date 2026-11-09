import { FaqList } from "@/components/FaqList";
import { faq } from "@/content/home";
import { Section, SectionHead } from "./primitives";

export function FaqSection() {
  return (
    <Section
      id="faq"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "0.8fr 1.2fr" },
        gap: { xs: 4, md: 8 },
      }}
    >
      <SectionHead kicker="05" title="Вопросы о покупке" />
      <FaqList items={faq} />
    </Section>
  );
}
