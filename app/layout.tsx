import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "./share";

const TITLE = "Справжнє фото чи згенероване ШІ?";
const DESC =
  "Перевірте, чи вмієте ви відрізнити справжню фотографію від зображення, згенерованого штучним інтелектом.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE_URL}/`,
    siteName: "Хмарочос",
    locale: "uk_UA",
    type: "website",
    images: [{ url: `${SITE_URL}/og-test.png`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [`${SITE_URL}/og-test.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
