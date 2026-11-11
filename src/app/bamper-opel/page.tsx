import type { Metadata } from "next";
import { BuyPage } from "@/components/buy/BuyPage";
import { buyPages } from "@/content/buy";

const page = buyPages.find((item) => item.path === "/bamper-opel") ?? buyPages[3];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.path },
};

export default function BamperOpelPage() {
  return <BuyPage page={page} />;
}
