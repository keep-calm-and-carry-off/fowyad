import { asset } from "@/lib/base-path";

export default function AboutRedirect() {
  const href = asset("/#company");
  return <meta httpEquiv="refresh" content={`0; url=${href}`} />;
}