// Публічна адреса задеплоєного сайту — шер завжди веде на неї (навіть у dev).
export const SITE_URL = "https://yakovina.github.io/aitest";

// Загальний текст, коли ділимося самим тестом (інтро / під час проходження).
export const TEST_SHARE_TEXT =
  "Справжнє фото чи згенероване ШІ? Перевір, чи зможеш відрізнити:";

export const TEST_SHARE_TITLE = "Справжнє фото чи згенероване ШІ?";

/** URL шер-сторінки конкретного результату: /r/{slug}/ */
export function resultShareUrl(slug: string): string {
  return `${SITE_URL}/r/${slug}/`;
}
