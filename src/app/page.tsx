import Box from "@mui/material/Box";
import type { Metadata } from "next";
import { CompanySection } from "@/components/home/CompanySection";
import { FactorySection } from "@/components/home/FactorySection";
import { FaqSection } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { ModelsSection } from "@/components/home/ModelsSection";
import { RangeSection } from "@/components/home/RangeSection";
import { ReasonsSection } from "@/components/home/ReasonsSection";
import { JsonLd } from "@/components/JsonLd";
import { faq } from "@/content/home";
import { faqJsonLd, storeJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <Box component="main" id="content">
      <JsonLd data={[websiteJsonLd(), storeJsonLd(), faqJsonLd(faq)]} />
      <Hero />
      <RangeSection />
      <ModelsSection />
      <FactorySection />
      <ReasonsSection />
      <FaqSection />
      <CompanySection />
    </Box>
  );
}
