import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { OZON_BRAND_URL } from "@/lib/config";

export const displayFont = "var(--font-unbounded), sans-serif";

const column = {
  width: "min(1120px, calc(100% - 48px))",
  mx: "auto",
  py: { xs: 8, md: 12 },
} as const;

export function Section({
  id,
  children,
  divided = true,
  sx,
}: {
  id: string;
  children: ReactNode;
  divided?: boolean;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      id={id}
      component="section"
      sx={divided ? { borderTop: "1px solid", borderColor: "divider" } : undefined}
    >
      <Box sx={[column, ...(Array.isArray(sx) ? sx : [sx])]}>{children}</Box>
    </Box>
  );
}

export function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Box>
      <Typography color="primary" sx={{ fontFamily: displayFont, fontSize: "0.75rem", letterSpacing: "0.2em" }}>
        {kicker}
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: "1.9rem", md: "2.7rem" }, mt: 1 }}>
        {title}
      </Typography>
    </Box>
  );
}

export function Lead({ children, maxWidth = 560 }: { children: ReactNode; maxWidth?: number }) {
  return (
    <Typography color="text.secondary" sx={{ maxWidth, mt: 2, lineHeight: 1.7 }}>
      {children}
    </Typography>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Box sx={{ py: 0.5, pr: 2 }}>
      <Typography sx={{ fontFamily: displayFont, fontSize: { xs: "1.45rem", md: "1.85rem" }, letterSpacing: "-0.03em" }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
    </Box>
  );
}

export function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ py: 2, borderTop: "1px solid", borderColor: "divider" }}>
      <Typography variant="overline" sx={{ letterSpacing: "0.16em", color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.5 }}>{value}</Typography>
    </Box>
  );
}

export function FactStack({
  items,
  sx,
}: {
  items: Array<{ label: string; value: string }>;
  sx?: SxProps<Theme>;
}) {
  return (
    <Stack spacing={0} sx={sx}>
      {items.map((item) => (
        <Fact key={item.label} label={item.label} value={item.value} />
      ))}
    </Stack>
  );
}

export function ShopButton({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Button href={OZON_BRAND_URL} target="_blank" rel="noreferrer" variant="contained" sx={sx}>
      {children}
    </Button>
  );
}
