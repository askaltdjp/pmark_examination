// 認証用クッキーの名前
export const AUTH_TOKEN_COOKIE_NAME = "auth-token";

// 認証トークンの有効期限（秒単位）※例：1時間
export const AUTH_TOKEN_COOKIE_MAX_AGE = 60 * 60;

// レスポンスヘッダに設定する社員IDのキー名
export const EMPLOYEE_ID_HEADER = "x-employee-id";

// セッションストレージに保存する試験データのキー名
export const SESSION_STORAGE_EXAM_DATA_KEY = "examData";

// Excelテンプレートファイルが格納されているディレクトリ名
export const EXAM_TEMPLATE_DIR = "templates";

// 試験結果Excelテンプレートファイル名のフォーマット
export const EXAM_RESULT_TEMPLATE_FILENAME = "[試験名]_受験結果_([氏名])_[yyyymmdd].xlsx";