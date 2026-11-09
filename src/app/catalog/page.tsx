import { asset } from "@/lib/base-path";

export default function CatalogRedirect() {
  const href = asset("/");
  return (
    <meta httpEquiv="refresh" content={`0; url=${href}`} />
  );
}
