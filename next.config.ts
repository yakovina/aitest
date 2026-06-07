import type { NextConfig } from "next";

// На GitHub Pages сайт живе за адресою https://yakovina.github.io/aitest/,
// тому в продакшені додаємо basePath. Локально (dev) лишаємо корінь.
const isProd = process.env.NODE_ENV === "production";
const repo = "aitest";

const nextConfig: NextConfig = {
  output: "export", // статичний експорт у ./out
  basePath: isProd ? `/${repo}` : "",
  images: { unoptimized: true }, // next/image без сервера оптимізації
  trailingSlash: true, // акуратні шляхи для статичного хостингу
};

export default nextConfig;
