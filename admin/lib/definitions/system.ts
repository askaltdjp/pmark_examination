// 認証用クッキーの名前
export const AUTH_TOKEN_COOKIE_NAME = "auth-token";

// 認証トークンの有効期限（秒単位）※例：1時間
export const AUTH_TOKEN_COOKIE_MAX_AGE = 60 * 60;

// レスポンスヘッダに設定するログインIDのキー名
export const LOGIN_ID_HEADER = 'x-login-id';

// 試験名の最大長
export const MAX_TEST_NAME_LENGTH = 64;

// 最大出題数
// 20問以上設定したい場合はExcelテンプレートの調整が必要
export const MAX_QUESTION_NUM = 20;