import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Справжнє фото чи згенероване ШІ?",
  description:
    "Перевірте, чи вмієте ви відрізнити справжню фотографію від зображення, згенерованого штучним інтелектом.",
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
