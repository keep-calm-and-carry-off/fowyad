"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function FaqList({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      {items.map((item) => (
        <Accordion
          key={item.q}
          disableGutters
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            borderBottom: "1px solid",
            borderColor: "divider",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={
              <Typography component="span" color="primary" sx={{ fontFamily: "var(--font-unbounded), sans-serif", fontSize: "1.1rem", lineHeight: 1 }}>
                +
              </Typography>
            }
            sx={{
              px: { xs: 2.5, md: 3 },
              py: 1.25,
              "& .MuiAccordionSummary-content": { my: 2.25, minWidth: 0, pr: 3 },
            }}
          >
            <Typography
              sx={{
                fontFamily: "var(--font-unbounded), sans-serif",
                fontWeight: 500,
                fontSize: "1.02rem",
                overflowWrap: "break-word",
              }}
            >
              {item.q}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: { xs: 2.5, md: 3 }, pt: 0, pb: 3 }}>
            <Typography color="text.secondary">{item.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
