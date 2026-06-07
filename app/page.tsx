"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { intro, questions, getLevel, type GameState } from "@/data/quiz";

const NAVY = "#000e2a";
const ICE = "#d4f9ff";
const CYAN = "#08a1cf";
const XRED = "#e8412a"; // бренд-червоний «Хмарочоса» (кікер, маркери, = verdict-red)

// Вердикт відповіді: червоний — бренд-червоний Хмарочоса, зелений — у тон до нього.
const GREEN = "#1fa85c"; // правильно
const RED = "#e8412a"; // неправильно (= бренд-червоний)

const pad = (n: number) => String(n).padStart(2, "0");

// Префікс для статики на GitHub Pages (next/image з unoptimized не додає basePath сам).
const BP = process.env.NODE_ENV === "production" ? "/aitest" : "";

/** Рендер пояснення: ключові слова в **...** — «дата-токени»:
 *  інтерфейсний шрифт (контраст до серифного тексту) + чітка cyan-лінія знизу. */
function renderExplanation(text: string): ReactNode[] {
  return text.split("**").map((seg, i) =>
    i % 2 === 1 ? (
      <span
        key={i}
        style={{
          fontFamily: '"Open Sans", system-ui, sans-serif',
          fontWeight: 700,
          color: NAVY,
          background: `${CYAN}1f`,
          boxShadow: `inset 0 -2px 0 ${CYAN}`,
          padding: "0 4px",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
        }}
      >
        {seg}
      </span>
    ) : (
      <span key={i}>{seg}</span>
    ),
  );
}

// Роботизована кнопка-дія: темна, з блакитним контуром і неоновим світінням на ховері.
const ACTION_BTN =
  "mono font-bold uppercase tracking-[0.2em] transition-all bg-[#000e2a] text-[#08a1cf] " +
  "border border-[#08a1cf]/40 hover:text-white hover:border-[#08a1cf] " +
  "hover:shadow-[0_0_20px_rgba(8,161,207,0.5)]";

/** Панель зі зрізаними кутами та тонкою неоновою рамкою (sci-fi HUD). */
function Panel({
  children,
  className = "",
  accent = CYAN,
}: {
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className="clip-tech"
      style={{
        background: accent,
        padding: 2,
        filter: `drop-shadow(0 12px 28px rgba(0,0,0,0.5)) drop-shadow(0 0 6px ${accent}33)`,
      }}
    >
      <div className={`clip-tech ${className}`}>{children}</div>
    </div>
  );
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [zoomed, setZoomed] = useState(false); // фото відкрите на весь екран

  // Закрити зум по Esc
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomed(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  // Плавно докрутити до вердикту, коли картка «виросла» після відповіді.
  const feedbackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (gameState === "feedback") {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [gameState]);

  const question = questions[currentQuestion];
  const total = questions.length;
  const isLast = currentQuestion + 1 >= total;

  function handleAnswer(saidAI: boolean) {
    const correct = saidAI === question.isAI;
    setWasCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setGameState("feedback");
  }

  function handleNext() {
    setZoomed(false);
    if (isLast) {
      setGameState("finished");
    } else {
      setCurrentQuestion((q) => q + 1);
      setGameState("playing");
    }
  }

  function handleRestart() {
    setCurrentQuestion(0);
    setScore(0);
    setWasCorrect(false);
    setGameState("intro");
  }

  const level = getLevel(score);

  return (
    <div className="relative min-h-screen" style={{ background: NAVY }}>
      {/* Neon doodle background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image
          src={`${BP}/bg-art.png`}
          alt=""
          fill
          priority
          className="scale-105 object-cover blur-[3px]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 35%, rgba(0,14,42,0.55) 0%, rgba(0,14,42,0.82) 100%)",
          }}
        />
      </div>

      {/* Sticky HUD-хедер — лого «Хмарочоса» на кожному екрані */}
      <header
        className="sticky top-0 z-30 bg-[#000e2a]/20"
        style={{
          borderBottom: `1px solid ${CYAN}`,
          boxShadow: `0 1px 14px ${CYAN}55`,
        }}
      >
        <div className="mx-auto grid max-w-5xl grid-cols-3 items-center px-4 py-2.5">
          {/* статус-індикатор зліва */}
          <span className="mono hidden items-center gap-2 justify-self-start text-[10px] uppercase tracking-[0.25em] text-[#08a1cf] sm:flex">
            <span
              className="inline-block h-1.5 w-1.5 animate-pulse"
              style={{ background: CYAN, boxShadow: `0 0 6px ${CYAN}` }}
            />
            System Online
          </span>
          {/* лого по центру — лінк на сайт «Хмарочоса» */}
          <a
            href="https://hmarochos.kiev.ua/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Хмарочос — відкрити сайт"
            className="justify-self-center transition-opacity hover:opacity-80"
          >
            <Image
              src={`${BP}/hmarochos_logo_new.svg`}
              alt="Хмарочос"
              width={1490}
              height={549}
              priority
              className="h-7 w-auto sm:h-8"
            />
          </a>
          {/* технічна мітка справа */}
          <span className="mono hidden justify-self-end text-[10px] uppercase tracking-[0.25em] text-[#08a1cf]/60 sm:block">
            Test_v1.0
          </span>
        </div>
      </header>

      <div className="relative z-10 flex items-start justify-center px-4 pb-[6vh] pt-[5vh]">
        {/* ── INTRO ──────────────────────────────────────────── */}
        {gameState === "intro" && (
          <div className="w-full max-w-3xl">
            {/* червоний тег-кікер, як категорії на сайті */}
            <div className="mb-4 flex justify-center">
              <span
                className="inline-block px-2 py-1 text-xs font-bold uppercase tracking-[0.15em] text-white"
                style={{ background: XRED }}
              >
                Тест
              </span>
            </div>
            <h1
              className="headline mb-6 text-center text-4xl font-bold leading-tight text-white sm:text-5xl"
              style={{ textShadow: `0 0 18px ${CYAN}80` }}
            >
              Справжнє фото{" "}
              <span style={{ color: "rgba(255,255,255,0.65)" }}>чи</span>{" "}
              <span style={{ color: "#4fd6f5" }}>згенероване ШІ?</span>
              <span
                className="cursor-blink ml-1.5 inline-block"
                style={{
                  width: "4px",
                  height: "0.82em",
                  verticalAlign: "-0.04em",
                  background: "#4fd6f5",
                  boxShadow: "0 0 10px #4fd6f5",
                }}
              />
            </h1>
            <Panel className="card">
              <div className="p-5 sm:p-8" style={{ color: NAVY }}>
                {/* стат-стрічка — ключові цифри з тексту */}
                <div
                  className="mb-7 grid grid-cols-3 gap-4 border-t pt-5"
                  style={{ borderColor: "rgba(0,14,42,0.12)" }}
                >
                  {[
                    { v: "15 млрд", c: "згенерованих зображень за два роки" },
                    { v: "20–40 с", c: "потрібно ШІ на одне фото" },
                    { v: "50–60%", c: "точність людей — майже як навмання" },
                  ].map((s) => (
                    <div key={s.v}>
                      <div className="text-xl font-black leading-none sm:text-3xl">
                        {s.v}
                      </div>
                      <div
                        className="prose mt-2 text-xs leading-snug"
                        style={{ color: "rgba(0,14,42,0.6)" }}
                      >
                        {s.c}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="prose space-y-3 text-sm leading-relaxed sm:text-base">
                  <p className="dropcap">{renderExplanation(intro[0])}</p>
                  {showMore &&
                    intro
                      .slice(1, -1)
                      .map((p, i) => <p key={i}>{renderExplanation(p)}</p>)}
                  <p>{renderExplanation(intro[intro.length - 1])}</p>
                </div>
                <button
                  onClick={() => setShowMore((v) => !v)}
                  className="mt-3 text-sm font-bold underline decoration-2 underline-offset-4 transition-colors hover:opacity-70"
                  style={{ color: NAVY }}
                >
                  {showMore ? "Згорнути ↑" : "Читати більше ↓"}
                </button>

                {/* Як це працює — 3 кроки */}
                <div
                  className="mt-7 border-t pt-5"
                  style={{ borderColor: "rgba(0,14,42,0.12)" }}
                >
                  <p
                    className="mono mb-4 text-xs uppercase tracking-[0.25em]"
                    style={{ color: "rgba(0,14,42,0.5)" }}
                  >
                    Як це працює
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                    {[
                      "Дивіться на зображення",
                      "Оберіть: ШІ чи справжнє фото",
                      "Дізнайтеся правду та факти",
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center text-sm font-black text-white"
                          style={{ background: XRED }}
                        >
                          {i + 1}
                        </span>
                        <span
                          className="text-xs leading-snug"
                          style={{ color: "rgba(0,14,42,0.7)" }}
                        >
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setGameState("playing")}
                  className={`${ACTION_BTN} mt-7 w-full px-12 py-4 text-base`}
                >
                  [ Почати тест ]
                </button>
              </div>
            </Panel>
          </div>
        )}

        {/* ── PLAYING / FEEDBACK (на одній картці) ─────────────── */}
        {(gameState === "playing" || gameState === "feedback") && (
          <div className="w-full max-w-3xl">
            <Panel>
              <div style={{ background: NAVY }}>
                {/* HUD header */}
                <div
                  className="mono flex items-center justify-between px-4 py-3 sm:px-6 text-xs uppercase tracking-[0.2em]"
                  style={{ background: ICE, color: NAVY }}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2"
                      style={{ background: CYAN }}
                    />
                    ПИТАННЯ {pad(currentQuestion + 1)}/{pad(total)}
                  </span>
                  <span>
                    SCORE{" "}
                    <span className="font-black" style={{ color: XRED }}>
                      {pad(score)}
                    </span>
                  </span>
                </div>

                {/* Question image */}
                <div
                  className="relative flex aspect-video w-full items-center justify-center"
                  style={{ background: NAVY }}
                >
                  {question.image ? (
                    <button
                      type="button"
                      onClick={() => setZoomed(true)}
                      className="group absolute inset-0 cursor-zoom-in"
                      aria-label="Збільшити фото"
                    >
                      <Image
                        src={`${BP}${question.image}`}
                        alt={question.title}
                        fill
                        className="object-contain"
                      />
                      {/* підказка «збільшити» */}
                      <span className="mono pointer-events-none absolute right-2 top-6 z-20 flex items-center gap-1 bg-[#000e2a]/70 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#d4f9ff] opacity-80 transition-opacity group-hover:opacity-100">
                        <span className="text-sm leading-none">⤢</span>
                        <span className="hidden sm:inline">збільшити</span>
                      </span>
                    </button>
                  ) : (
                    <div className="mono text-center">
                      <p
                        className="text-sm uppercase tracking-[0.3em]"
                        style={{ color: "rgba(212,249,255,0.35)" }}
                      >
                        IMG_{pad(currentQuestion + 1)}
                      </p>
                      <p
                        className="mt-2 max-w-xs px-4 text-xs"
                        style={{ color: "rgba(212,249,255,0.25)" }}
                      >
                        {question.title}
                      </p>
                    </div>
                  )}
                  {/* легке затемнення зверху — щоб прогрес читався на світлих фото */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,14,42,0.45), transparent)",
                    }}
                  />
                  {/* прозорий сегментований прогрес поверх фото */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex gap-[3px] p-2">
                    {questions.map((q, i) => (
                      <div
                        key={q.id}
                        className="h-1.5 flex-1"
                        style={{
                          background:
                            i < currentQuestion
                              ? "rgba(255,255,255,0.95)"
                              : i === currentQuestion
                                ? "rgba(255,255,255,0.55)"
                                : "rgba(255,255,255,0.25)",
                        }}
                      />
                    ))}
                  </div>

                  {/* назва фото — HUD-підпис, показуємо після відповіді */}
                  {gameState === "feedback" && question.title && (
                    <div className="mono pointer-events-none absolute bottom-2 left-2 z-20 flex items-center gap-2 bg-[#000e2a]/75 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-[#d4f9ff]">
                      <span className="opacity-50">FILE:</span>
                      {question.title}
                    </div>
                  )}
                </div>

                {/* Низ картки: до відповіді — кнопки, після — вердикт і пояснення */}
                {gameState === "playing" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <button
                      onClick={() => handleAnswer(true)}
                      className="group relative flex flex-col justify-center gap-1 overflow-hidden border-b-2 border-[#000e2a] bg-[#d4f9ff] p-5 pr-[72px] text-left transition-all hover:bg-[#000e2a] hover:shadow-[inset_0_0_0_1px_#08a1cf,0_0_22px_rgba(8,161,207,0.55)] sm:border-b-0 sm:border-r-2 sm:p-6 sm:pr-28"
                    >
                      <span className="text-base font-black uppercase tracking-wide text-[#000e2a] group-hover:text-[#08a1cf]">
                        Це ШІ
                      </span>
                      <span className="mono text-[10px] uppercase tracking-[0.25em] text-[#000e2a]/50 group-hover:text-[#08a1cf]/80">
                        [ generated ]
                      </span>
                      <Image
                        src={`${BP}/icon-ai.png`}
                        alt=""
                        width={104}
                        height={104}
                        className="pointer-events-none absolute right-1 top-1/2 h-auto w-16 -translate-y-1/2 transition-all group-hover:brightness-0 group-hover:invert sm:w-24"
                      />
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      className="group relative flex flex-col justify-center gap-1 overflow-hidden bg-[#d4f9ff] p-5 pr-[72px] text-left transition-all hover:bg-[#000e2a] hover:shadow-[inset_0_0_0_1px_#08a1cf,0_0_22px_rgba(8,161,207,0.55)] sm:p-6 sm:pr-28"
                    >
                      <span className="text-base font-black uppercase tracking-wide text-[#000e2a] group-hover:text-[#08a1cf]">
                        Це справжнє фото
                      </span>
                      <span className="mono text-[10px] uppercase tracking-[0.25em] text-[#000e2a]/50 group-hover:text-[#08a1cf]/80">
                        [ real ]
                      </span>
                      <Image
                        src={`${BP}/icon-photo.png`}
                        alt=""
                        width={104}
                        height={104}
                        className="pointer-events-none absolute right-1 top-1/2 h-auto w-16 -translate-y-1/2 transition-all group-hover:brightness-0 group-hover:invert sm:w-24"
                      />
                    </button>
                  </div>
                ) : (
                  <div ref={feedbackRef} className="reveal card" style={{ color: NAVY }}>
                    {/* вердикт як термінальний readout — суцільна плашка в стилі HUD гри */}
                    <div
                      className="mono flex items-center gap-3 px-5 py-4 uppercase tracking-[0.2em] text-white sm:px-8"
                      style={{ background: wasCorrect ? GREEN : RED }}
                    >
                      <span className="inline-block h-3 w-3 shrink-0 bg-white" />
                      <span className="text-lg font-black sm:text-2xl">
                        [ {wasCorrect ? "OK" : "ERR"} ] {wasCorrect ? "Правильно" : "Неправильно"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 px-5 sm:px-8 pt-6">
                      <div className="flex-1">
                        <p
                          className="mono text-[11px] font-bold uppercase tracking-[0.25em]"
                          style={{ color: "#0a6f8f" }}
                        >
                          {"// Вірна відповідь"}
                        </p>
                        <span
                          className="mt-1.5 inline-block px-3 py-1 text-lg font-black uppercase tracking-wide"
                          style={{ background: NAVY, color: ICE }}
                        >
                          {question.isAI ? "Згенеровано ШІ" : "Справжнє фото"}
                        </span>
                      </div>
                      <Image
                        src={`${BP}${question.isAI ? "/answer-ai.png" : "/answer-photo.png"}`}
                        alt=""
                        width={128}
                        height={128}
                        className="h-24 w-24 shrink-0 sm:h-28 sm:w-28"
                      />
                    </div>

                    <div className="px-5 sm:px-8 pb-2 pt-3">
                      <p className="prose text-[0.95rem] leading-7" style={{ color: "rgba(0,14,42,0.85)" }}>
                        {renderExplanation(question.explanation)}
                      </p>
                    </div>

                    <div className="p-5 pt-5 sm:p-8">
                      <button
                        onClick={handleNext}
                        className={`${ACTION_BTN} w-full py-3 text-sm`}
                      >
                        {isLast ? "[ Переглянути результат → ]" : "[ Продовжити → ]"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          </div>
        )}

        {/* ── FINISHED ───────────────────────────────────────── */}
        {gameState === "finished" && (
          <div className="w-full max-w-3xl">
            <Panel className="card">
              <div style={{ color: NAVY }}>
                <div className="relative h-40 w-full overflow-hidden">
                  <Image src={`${BP}${level.image}`} alt="" fill className="object-cover object-top" />
                </div>
                <div className="px-5 pb-8 pt-5 sm:px-8">
                  {/* великий HUD-readout рахунку — у бренд-червоному «Хмарочоса» */}
                  <div className="mb-5 border-t-2 pt-5" style={{ borderColor: XRED }}>
                    <div
                      className="mono mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em]"
                      style={{ color: "rgba(0,14,42,0.5)" }}
                    >
                      <span className="inline-block h-2.5 w-2.5" style={{ background: XRED }} />
                      Результат тесту
                    </div>
                    <div className="flex items-end gap-3">
                      <span
                        className="mono font-black leading-none tabular-nums"
                        style={{ fontSize: "3.75rem", color: NAVY }}
                      >
                        {pad(score)}
                      </span>
                      <span
                        className="mono pb-1.5 text-2xl font-bold leading-none tabular-nums"
                        style={{ color: "rgba(0,14,42,0.4)" }}
                      >
                        / {pad(total)}
                      </span>
                    </div>
                    {/* сегментований бар правильних відповідей */}
                    <div className="mt-3 flex gap-[3px]">
                      {questions.map((q, i) => (
                        <div
                          key={q.id}
                          className="h-2 flex-1"
                          style={{ background: i < score ? NAVY : "rgba(0,14,42,0.12)" }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="headline mb-3 text-2xl font-bold leading-tight sm:text-3xl">
                    Рівень «{level.title}»{" "}
                    <span className="text-lg font-normal">
                      ({level.min}–{level.max} балів)
                    </span>
                  </p>
                  <p className="prose mb-6 text-sm leading-relaxed">{level.description}</p>
                  <button
                    onClick={handleRestart}
                    className={`${ACTION_BTN} px-10 py-3 text-sm`}
                  >
                    [ Пройти ще раз ]
                  </button>
                  <p
                    className="mt-6 border-t pt-4 text-xs uppercase tracking-[0.2em]"
                    style={{ borderColor: "rgba(0,14,42,0.12)", color: "rgba(0,14,42,0.5)" }}
                  >
                    Тест • <span className="font-extrabold">Хмарочос</span>
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        )}
      </div>

      {/* ── LIGHTBOX: фото на весь екран ───────────────────── */}
      {zoomed && question.image && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomed(false)}
          className="reveal fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          style={{ background: "rgba(0,14,42,0.92)" }}
        >
          <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={`${BP}${question.image}`}
              alt={question.title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          {/* кнопка закриття */}
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Закрити"
            className="mono absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-[#08a1cf]/40 bg-[#000e2a] text-lg text-[#08a1cf] transition-all hover:border-[#08a1cf] hover:text-white hover:shadow-[0_0_20px_rgba(8,161,207,0.5)]"
          >
            ✕
          </button>
          <span className="mono pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-[#d4f9ff]/50">
            Клік або Esc — закрити
          </span>
        </div>
      )}
    </div>
  );
}
