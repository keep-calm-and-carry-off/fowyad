"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { METRIKA_ID } from "@/lib/config";
import { allowsAnalytics, subscribeConsent } from "@/lib/consent";

const METRIKA_SRC = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`;

type MetrikaFn = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };

let ready = false;

function installMetrika() {
  if (ready) return;
  ready = true;
  const host = window as Window & { ym?: MetrikaFn };
  host.ym =
    host.ym ||
    Object.assign(
      (...args: unknown[]) => {
        const queue = host.ym;
        if (!queue) return;
        queue.a = queue.a || [];
        queue.a.push(args);
      },
      { l: Date.now() } as Pick<MetrikaFn, "l">,
    );
  host.ym.l = Date.now();
  const already = [...document.scripts].some((script) => script.src === METRIKA_SRC);
  if (!already) {
    const script = document.createElement("script");
    const first = document.getElementsByTagName("script")[0];
    script.async = true;
    script.src = METRIKA_SRC;
    first?.parentNode?.insertBefore(script, first);
  }
  host.ym(METRIKA_ID, "init", {
    ssr: true,
    webvisor: true,
    clickmap: true,
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
}

function clearMetrikaCookies() {
  const host = location.hostname;
  const names = document.cookie
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter((name) => name.startsWith("_ym"));
  for (const name of names) {
    for (const domain of ["", host, `.${host}`]) {
      const scope = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; Max-Age=0; path=/${scope}`;
    }
  }
}

function disableMetrika() {
  if (!ready) return;
  const host = window as Window & { ym?: MetrikaFn };
  try {
    host.ym?.(METRIKA_ID, "destruct");
  } catch {
    // Счётчик уже мог не отвечать на destruct: ниже он всё равно отключается.
  }
  delete host.ym;
  document.querySelectorAll('script[src*="mc.yandex.ru"]').forEach((node) => node.remove());
  clearMetrikaCookies();
  ready = false;
}

export function YandexMetrika() {
  const allowed = useSyncExternalStore(subscribeConsent, allowsAnalytics, () => false);
  const pathname = usePathname();
  const seen = useRef<string | null>(null);

  useEffect(() => {
    if (!allowed) {
      seen.current = null;
      return;
    }
    if (seen.current === null) installMetrika();
    else {
      const host = window as Window & { ym?: MetrikaFn };
      host.ym?.(METRIKA_ID, "hit", window.location.href, { referer: document.referrer });
    }
    seen.current = pathname;
  }, [allowed, pathname]);

  if (!allowed) return null;

  return (
    <noscript>
      <div>
        <img src={`https://mc.yandex.ru/watch/${METRIKA_ID}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
      </div>
    </noscript>
  );
}
