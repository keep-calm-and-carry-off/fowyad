import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { buyPages } from "@/content/buy";
import { range } from "@/content/home";
import { displayFont, Lead, Section, SectionHead } from "./primitives";

export function RangeSection() {
  return (
    <Section id="range" divided={false}>
      <SectionHead kicker="01" title="Для Opel" />
      <Lead>Для Opel есть оптика и кузовные детали одной марки: фары, бамперы, решётки и пластик.</Lead>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
        {buyPages.map((page) => (
          <Link key={page.path} href={page.path} underline="hover">
            {page.title}
          </Link>
        ))}
      </Box>
      <Box
        sx={{
          mt: 5,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {range.map((item, index) => (
          <Box
            key={item.title}
            sx={{
              p: { xs: 3, md: 4 },
              borderTop: { xs: index === 0 ? "none" : "1px solid", md: "none" },
              borderLeft: { md: index === 0 ? "none" : "1px solid" },
              borderColor: "divider",
              transition: "background-color 0.2s ease",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.025)" },
            }}
          >
            <Typography color="primary" sx={{ fontFamily: displayFont, fontSize: "0.75rem", letterSpacing: "0.14em" }}>
              0{index + 1}
            </Typography>
            <Typography component="h3" sx={{ fontFamily: displayFont, fontSize: "1.45rem", mt: 3 }}>
              {item.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
