// 認証用クッキーの名前
export const AUTH_TOKEN_COOKIE_NAME = "admin-auth-token";

// 認証トークンの有効期限（秒単位）※例：3時間
export const AUTH_TOKEN_COOKIE_MAX_AGE = 3 * 60 * 60;

// レスポンスヘッダに設定するログインIDのキー名
export const LOGIN_ID_HEADER = 'x-login-id';

// 試験名の最大長
export const MAX_TEST_NAME_LENGTH = 64;

// 最大出題数
// 20問以上設定したい場合はExcelテンプレートの調整が必要
export const MAX_QUESTION_NUM = 20;

// 社員のデフォルトのパスワード長
export const EMPLOYEE_DEFAULT_PASSWORD_LENGTH = 8;

// Excelテンプレートファイルが格納されているディレクトリ名
export const EXAM_TEMPLATE_DIR = "templates";

// 試験結果Excelテンプレートファイル名のフォーマット
export const EXAM_RESULT_TEMPLATE_FILENAME = "[試験名]_受験結果_([氏名])_[yyyymmdd].xlsx";

// 受験状況Excelテンプレートファイル名のフォーマット
export const EXAM_STATE_TEMPLATE_FILENAME = "[試験名]_受験状況一覧_[yyyy年度].xlsx";