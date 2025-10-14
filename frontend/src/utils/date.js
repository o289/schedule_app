export function formatDateTime(isoString, mode = "datetime") {
  const date = new Date(isoString);
  switch (mode) {
    case "date":
      return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "time":
      return date.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "datetime":
      return date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
}

/*
利用方法:
formatDatePart(isoString, "datetime") // 年月日時分を返す（デフォルト）
formatDatePart(isoString, "date")     // 年月日を返す
formatDatePart(isoString, "time")     // 時分のみを返す
*/

// --- 日付補助関数 ---
// SafariでtoISOString()を使うとUTCに変換されてしまい、
// <input type="datetime-local"> にセットできなくなる。
// そこで、手動で「YYYY-MM-DDTHH:mm」形式の文字列を作る。
//
// 重複処理をまとめた共通関数
// → どんなDateオブジェクトでも安全にローカル時刻フォーマットできる
function formatLocalDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getNowDateTime() {
  // 現在時刻をローカルフォーマットで返す
  const now = new Date();
  return formatLocalDateTime(now);
}

export function getNowPlusOneHour() {
  // 現在時刻＋1時間をローカルフォーマットで返す
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return formatLocalDateTime(now);
}
