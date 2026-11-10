import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { METRIKA_ID, WHOLESALE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Согласие на cookie и персональные данные",
  description:
    "Текст согласия на cookie и на обработку персональных данных сайта FOWYAD: кто обрабатывает сведения визита и для чего.",
  alternates: { canonical: "/consent" },
  robots: { index: true, follow: true },
};

export default function ConsentPage() {
  return (
    <Box component="main" sx={{ width: "min(760px, calc(100% - 32px))", mx: "auto", py: { xs: 5, md: 8 } }}>
      <Typography variant="overline" color="primary" sx={{ letterSpacing: "0.16em" }}>
        152-ФЗ
      </Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "2.7rem" }, mt: 1 }}>
        Согласие на cookie и персональные данные
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        Редакция от 10 ноября 2026 года. Это отдельный текст согласия. Он не входит в договор, оферту или политику. Политика обработки опубликована на странице{" "}
        <Link href="/privacy">персональных данных</Link>.
      </Typography>

      <Section title="1. Что даёт кнопка «Принять»">
        Нажатие «Принять» в панели на сайте — согласие на cookie и согласие на обработку персональных данных, описанных ниже. Молчание, прокрутка, закрытие панели и переход по сайту согласием не являются. «Отклонить» согласие не даёт: сайт остаётся открытым, счётчик посещаемости не подключается. Отозвать согласие можно той же кнопкой «Отклонить», панель снова открывает ссылка «Настройки cookie» внизу сайта.
      </Section>

      <Section title="2. Cookie">
        Согласие на cookie даётся и на те, которые сайт только сохраняет в браузере, и на cookie счётчика.
        <br />
        <br />
        Техническая запись <code>fowyad-consent</code> хранится в браузере после любого выбора, «Принять» или «Отклонить». В ней нет имени и контактов: только факт выбора, версия текста и время. На сервер сайта она не отправляется. Она нужна, чтобы не показывать панель заново. Запись удаляется, когда посетитель очищает данные сайта в браузере.
        <br />
        <br />
        Cookie счётчика Яндекс Метрики — <code>_ym_uid</code>, <code>_ym_d</code>, <code>_ym_isad</code> и <code>_ym_visorc_{METRIKA_ID}</code> — появляются только после «Принять». После «Отклонить» эти cookie удаляются. Рекламные cookie сайт не ставит и не читает.
      </Section>

      <Section title="3. Кто обрабатывает и для чего">
        Оператор — {WHOLESALE.legalName}, ИНН {WHOLESALE.inn}, ОГРНИП {WHOLESALE.ogrnip}, {WHOLESALE.postalCode}, {WHOLESALE.city}, {WHOLESALE.street}. Вопросы по этому согласию:{" "}
        <Link href={`mailto:${WHOLESALE.email}`}>{WHOLESALE.email}</Link>, {WHOLESALE.phoneLabel}, {WHOLESALE.person}.
        <br />
        <br />
        Состав сведений визита: cookie счётчика, IP-адрес, адрес страницы, источник перехода, данные браузера, клики и запись вебвизора — как посетитель двигался по страницам. Имя, телефон и платёжные данные через эту обработку не собираются.
        <br />
        <br />
        Цель — видеть посещаемость сайта. Получатель сведений — ООО «ЯНДЕКС», счётчик № {METRIKA_ID}. По документам Яндекса запись ведётся в России. Зарубежный счётчик не подключён. Согласие действует, пока его не отзовут. После отзыва счётчик отключается, cookie Метрики на устройстве удаляются.
      </Section>
    </Box>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box component="section" sx={{ mt: 4 }}>
      <Typography variant="h2" sx={{ fontSize: "1.35rem" }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.25, "& code": { color: "text.primary" } }}>
        {children}
      </Typography>
    </Box>
  );
}
