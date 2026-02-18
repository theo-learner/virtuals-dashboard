/**
 * Lightweight i18n utility — ready for next-intl migration.
 * Currently supports ko (default) and en.
 */

export type Locale = "ko" | "en";

const messages: Record<Locale, Record<string, string>> = {
  ko: {
    "nav.dashboard": "대시보드",
    "nav.analytics": "분석",
    "nav.insights": "인사이트",
    "common.retry": "다시 시도",
    "common.home": "홈으로 돌아가기",
    "common.search": "에이전트 검색...",
    "common.allCategories": "전체 카테고리",
    "common.all": "전체",
    "common.revenuePositive": "수익 > 0",
    "common.prev": "이전",
    "common.next": "다음",
    "common.copy": "복사",
    "common.copied": "복사됨!",
    "error.title": "문제가 발생했습니다",
    "error.description": "잠시 후 다시 시도해 주세요.",
    "notFound.title": "페이지를 찾을 수 없습니다",
    "notFound.description": "요청하신 페이지가 존재하지 않습니다.",
    "table.rank": "순위",
    "table.agent": "에이전트",
    "table.revenue": "수익",
    "table.successRate": "성공률",
    "table.buyers": "바이어",
    "table.rating": "평점",
    "chart.categoryDist": "카테고리 분포",
    "chart.topRevenue": "수익 상위 20",
    "chart.successVsRevenue": "성공률 vs 수익",
    "chart.roleDist": "역할 분포",
    "agent.notFound": "에이전트를 찾을 수 없습니다",
    "agent.back": "← 돌아가기",
    "agent.backDashboard": "← 대시보드로 돌아가기",
    "agent.graduated": "🎓 졸업 완료",
    "agent.twitter": "𝕏 트위터 ↗",
    "agent.website": "🌐 웹사이트 ↗",
    "agent.rank": "순위",
    "agent.revenue": "수익 (VIRTUAL)",
    "agent.successRate": "성공률",
    "agent.buyers": "바이어",
    "agent.rating": "평점",
    "agent.completedJobs": "완료 작업",
    "agent.prizePool": "상금 풀",
    "agent.level": "레벨",
    "agent.marketData": "📊 시장 데이터",
    "agent.mcap": "시가총액 (VIRTUAL)",
    "agent.volume24h": "24h 거래량",
    "agent.priceChange24h": "24h 변동률",
    "agent.holders": "홀더 수",
    "agent.top10Holders": "상위 10 홀더",
    "agent.tokenInfo": "🪙 토큰 정보",
    "agent.tokenAddress": "토큰 주소",
    "agent.lpAddress": "LP 주소",
    "agent.chain": "체인",
    "agent.launchDate": "출시일",
    "agent.viewBaseScan": "보기 ↗",
    "agent.videoPitch": "🎬 비디오 피치",
    "agent.watchVideo": "비디오 보기 ↗",
  },
  en: {
    "nav.dashboard": "Dashboard",
    "nav.analytics": "Analytics",
    "nav.insights": "Insights",
    "common.retry": "Retry",
    "common.home": "Go Home",
    "common.search": "Search agents...",
    "common.allCategories": "All Categories",
    "common.all": "All",
    "common.revenuePositive": "Revenue > 0",
    "common.prev": "Previous",
    "common.next": "Next",
    "common.copy": "Copy",
    "common.copied": "Copied!",
    "error.title": "Something went wrong",
    "error.description": "Please try again later.",
    "notFound.title": "Page not found",
    "notFound.description": "The page you requested does not exist.",
    "table.rank": "Rank",
    "table.agent": "Agent",
    "table.revenue": "Revenue",
    "table.successRate": "Success Rate",
    "table.buyers": "Buyers",
    "table.rating": "Rating",
    "chart.categoryDist": "Category Distribution",
    "chart.topRevenue": "Top 20 Revenue",
    "chart.successVsRevenue": "Success Rate vs Revenue",
    "chart.roleDist": "Role Distribution",
    "agent.notFound": "Agent not found",
    "agent.back": "← Back",
    "agent.backDashboard": "← Back to Dashboard",
    "agent.graduated": "🎓 Graduated",
    "agent.twitter": "𝕏 Twitter ↗",
    "agent.website": "🌐 Website ↗",
    "agent.rank": "Rank",
    "agent.revenue": "Revenue (VIRTUAL)",
    "agent.successRate": "Success Rate",
    "agent.buyers": "Buyers",
    "agent.rating": "Rating",
    "agent.completedJobs": "Completed Jobs",
    "agent.prizePool": "Prize Pool",
    "agent.level": "Level",
    "agent.marketData": "📊 Market Data",
    "agent.mcap": "Market Cap (VIRTUAL)",
    "agent.volume24h": "24h Volume",
    "agent.priceChange24h": "24h Change",
    "agent.holders": "Holders",
    "agent.top10Holders": "Top 10 Holders",
    "agent.tokenInfo": "🪙 Token Info",
    "agent.tokenAddress": "Token Address",
    "agent.lpAddress": "LP Address",
    "agent.chain": "Chain",
    "agent.launchDate": "Launch Date",
    "agent.viewBaseScan": "View ↗",
    "agent.videoPitch": "🎬 Video Pitch",
    "agent.watchVideo": "Watch Video ↗",
  },
};

const DEFAULT_LOCALE: Locale = "ko";

let currentLocale: Locale = DEFAULT_LOCALE;

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: string, locale?: Locale): string {
  const l = locale ?? currentLocale;
  return messages[l]?.[key] ?? messages[DEFAULT_LOCALE]?.[key] ?? key;
}

export function getMessages(locale?: Locale): Record<string, string> {
  return messages[locale ?? currentLocale] ?? messages[DEFAULT_LOCALE];
}
