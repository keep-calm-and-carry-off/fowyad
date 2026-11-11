import type { Metadata } from "next";
import { BuyPage } from "@/components/buy/BuyPage";
import { buyPages } from "@/content/buy";

const page = buyPages[2];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.path },
};

export default function ReshetkaOpelPage() {
  return <BuyPage page={page} />;
}