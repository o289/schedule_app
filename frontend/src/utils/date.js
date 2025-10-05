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
