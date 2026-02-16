// ALERT_MESSAGES.js
// CRUD 自前アラート機能用メッセージ定義
// 許可フィールド: type, message のみ
// それ以外の情報を追加してはならない（README.curd.md 参照）

export const ALERT_MESSAGES = {
  // =========================
  // Success（成功）
  // =========================
  CREATE_SUCCESS: {
    type: "success",
    message: "作成しました",
  },
  UPDATE_SUCCESS: {
    type: "success",
    message: "更新しました",
  },
  DELETE_SUCCESS: {
    type: "success",
    message: "削除しました",
  },

  // =========================
  // Warning（想定内エラー）
  // =========================
  VALIDATION_ERROR: {
    type: "warning",
    message: "入力内容に誤りがあります",
  },
  //　スケジュール
  INVALID_TIME: {
    type: "warning",
    message: "終了時刻を開始時刻より前に入力しないでください",
  },
  NOT_FOUND_SCHEDULE: {
    type: "warning",
    message: "指定された予定が見つかりませんでした",
  },
  // カテゴリー
  NOT_FOUND_CATEGORY: {
    type: "warning",
    message: "指定されたカテゴリが見つかりませんでした",
  },
  CATEGORY_HAS_SCHEDULES: {
    type: "warning",
    message: "このカテゴリーにはスケジュールが存在します",
  },
  // ToDo
  NOT_FOUND_TODO: {
    type: "warning",
    message: "指定されたToDoが見つかりませんでした",
  },
  FORBIDDEN_SCHEDULE: {
    type: "warning",
    message: "ToDoを追加するスケジュールがありません",
  },
  // Auth
  EMAIL_ALREADY_EXISTS: {
    type: "warning",
    message: "このメールアドレスはすでに登録されています",
  },
  INVALID_CREDENTIALS: {
    type: "warning",
    message: "メールアドレスまたはパスワードが正しくありません",
  },

  INVALID_REFRESH_TOKEN: {
    type: "warning",
    message: "認証に失敗しました。再度ログインをしてください",
  },

  // =========================
  // Error（想定外エラー）
  // =========================
  SERVER_ERROR: {
    type: "error",
    message:
      "サーバーエラーが発生しました。ご迷惑をおかけして大変申し訳ございませんでした",
  },
};
