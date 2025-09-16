import { randomBytes } from 'crypto';

/**
 * 指定された長さのランダムな英数字文字列を生成
 * セキュアなランダム値（crypto）を使用して、初期パスワードや一時トークンなどに利用することを想定
 *
 * @param length - 生成する文字列の長さ
 * @returns ランダムに生成された英数字文字列
 *
 * @example
 * generateSecureRandomString(12);    // → "Zp8kLm2oWq9d"
 */
export function generateSecureRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return result;
}
