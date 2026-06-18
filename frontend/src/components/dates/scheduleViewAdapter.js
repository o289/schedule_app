// scheduleViewAdapter.js

function splitISODateTime(iso) {
  const [date, timeWithSec] = iso.split("T");
  return {
    date, // YYYY-MM-DD
    time: timeWithSec.slice(0, 5), // HH:mm
  };
}

function getTodayISODate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * pastPolicy:
 *  - "hide"      : 過去日付を除外
 *  - "show"      : すべて表示
 *  - "gray"      : フラグ付与（UI側で制御）
 */
export function buildTimeGroupsFromDates(apiDates, pastPolicy = "hide") {
  if (!Array.isArray(apiDates)) return [];

  const today = getTodayISODate();
  const map = new Map();

  apiDates.forEach((d) => {
    const start = splitISODateTime(d.start_date);
    const end = splitISODateTime(d.end_date);

    const isPast = start.date < today;

    // hide の場合のみここで除外
    if (pastPolicy === "hide" && isPast) return;

    const key = `${start.time}-${end.time}`;

    if (!map.has(key)) {
      map.set(key, {
        start: start.time,
        end: end.time,
        dates: [],
      });
    }

    map.get(key).dates.push({
      id: d.id,
      date: start.date,
      isPast, // show / gray / collapse 用
    });
  });

  return Array.from(map.values()).filter((tg) => tg.dates.length > 0);
}
