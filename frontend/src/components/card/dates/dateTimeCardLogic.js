// dateTimeCardLogic.js

/**
 * YYYY-MM-DD → 「M月D日」
 */
export function formatDate(isoDate) {
  const d = new Date(isoDate);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/**
 * dates の安全化
 */
export function normalizeDates(dates) {
  return Array.isArray(dates) ? dates : [];
}

/**
 * 最大表示数を超えた場合の制御
 */
export function getVisibleDates(dates, max = 5) {
  return {
    visible: dates.slice(0, max),
    rest: Math.max(dates.length - max, 0),
  };
}
