import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { JsonLd } from "@/components/JsonLd";
import { buyPages, type BuyPageData } from "@/content/buy";
import { faqJsonLd } from "@/lib/seo";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import { ActionRow, AvitoButton, displayFont, Section, ShopButton } from "@/components/home/primitives";

export function BuyPage({ page }: { page: BuyPageData }) {
  const others = buyPages.filter((item) => item.path !== page.path);
  return (
    <Box component="main">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: page.title,
            description: page.description,
            url: absoluteUrl(page.path),
            inLanguage: "ru",
            isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "FOWYAD", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: page.title, item: absoluteUrl(page.path) },
            ],
          },
          faqJsonLd(page.faqs),
        ]}
      />
      <Section id="buy" divided={false}>
        <Link href="/" color="text.secondary" underline="hover" sx={{ fontSize: "0.95rem" }}>
          FOWYAD
        </Link>
        <Typography variant="h1" sx={{ fontFamily: displayFont, fontSize: { xs: "2rem", md: "3rem" }, mt: 2, maxWidth: 720 }}>
          {page.title}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 640, mt: 2, lineHeight: 1.7 }}>
          {page.lead}
        </Typography>
        <ActionRow sx={{ mt: 3 }}>
          <ShopButton>Купить на Ozon</ShopButton>
          <AvitoButton>Купить на Авито</AvitoButton>
          <Link href="/#contacts" color="inherit" underline="hover" sx={{ fontWeight: 700 }}>
            Оптовый заказ
          </Link>
        </ActionRow>
        <Box
          sx={{
            mt: 6,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {page.points.map((point) => (
            <Box key={point.title} sx={{ py: 3, pr: { sm: 4 }, borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography component="h2" sx={{ fontFamily: displayFont, fontSize: "1.15rem" }}>
                {point.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
                {point.text}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 6 }}>
          {page.faqs.map((item) => (
            <Box key={item.q} sx={{ py: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography component="h2" sx={{ fontSize: "1.05rem" }}>
                {item.q}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
                {item.a}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 4 }}>
          {others.map((item) => (
            <Link key={item.path} href={item.path} underline="hover">
              {item.title}
            </Link>
          ))}
        </Box>
      </Section>
    </Box>
  );
}
