import type { Metadata } from "next";
import { BuyPage } from "@/components/buy/BuyPage";
import { buyPages } from "@/content/buy";

const page = buyPages[0];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.path },
};

export default function FaryOpelPage() {
  return <BuyPage page={page} />;
}
