import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLevelBySlug, levels } from "@/data/quiz";
import { SITE_URL, resultShareUrl } from "../../share";
import ShareButtons from "../../ShareButtons";

const NAVY = "#000e2a";
const CYAN = "#08a1cf";
const XRED = "#e8412a";
const BP = process.env.NODE_ENV === "production" ? "/aitest" : "";

// Статично генеруємо лише три сторінки рівнів.
export const dynamicParams = false;
export function generateStaticParams() {
  return levels.map((l) => ({ level: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const lvl = getLevelBySlug(level);
  if (!lvl) return {};

  const title = `Мій рівень — «${lvl.title}» · Справжнє фото чи ШІ?`;
  const ogImage = `${SITE_URL}/og-${lvl.slug}.png`;
  const url = resultShareUrl(lvl.slug);

  return {
    title,
    description: lvl.description,
    openGraph: {
      title,
      description: lvl.description,
      url,
      siteName: "Хмарочос",
      locale: "uk_UA",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: lvl.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: lvl.description,
      images: [ogImage],
    },
  };
}

export default async function ResultSharePage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const lvl = getLevelBySlug(level);
  if (!lvl) notFound();

  return (
    <div className="relative min-h-screen" style={{ background: NAVY }}>
      {/* фон */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image src={`${BP}/bg-art.jpg`} alt="" fill priority className="scale-105 object-cover blur-[3px]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 35%, rgba(0,14,42,0.55) 0%, rgba(0,14,42,0.82) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-[6vh]">
        <div className="w-full max-w-2xl">
          <div className="mb-4 flex justify-center">
            <span
              className="inline-block px-2 py-1 text-xs font-bold uppercase tracking-[0.15em] text-white"
              style={{ background: XRED }}
            >
              Результат тесту
            </span>
          </div>

          <div
            className="clip-tech"
            style={{
              background: CYAN,
              padding: 2,
              filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.5))",
            }}
          >
            <div className="clip-tech card" style={{ color: NAVY }}>
              <div className="relative h-44 w-full overflow-hidden">
                <Image src={`${BP}${lvl.image}`} alt="" fill className="object-cover object-top" />
              </div>
              <div className="px-5 pb-8 pt-5 sm:px-8">
                <p className="headline mb-3 text-2xl font-bold leading-tight sm:text-3xl">
                  Рівень «{lvl.title}»
                </p>
                <p className="prose mb-6 text-sm leading-relaxed">{lvl.description}</p>

                <Link
                  href="/"
                  className="mono inline-block w-full border border-[#08a1cf]/40 bg-[#000e2a] px-10 py-3 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#08a1cf] transition-all hover:border-[#08a1cf] hover:text-white hover:shadow-[0_0_20px_rgba(8,161,207,0.5)]"
                >
                  [ Пройти тест ]
                </Link>

                <div className="mt-6 border-t pt-5" style={{ borderColor: "rgba(0,14,42,0.12)" }}>
                  <ShareButtons url={resultShareUrl(lvl.slug)} text={lvl.shareText} title={lvl.title} />
                </div>

                <p
                  className="mt-6 text-xs uppercase tracking-[0.2em]"
                  style={{ color: "rgba(0,14,42,0.5)" }}
                >
                  Тест • <span className="font-extrabold">Хмарочос</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
