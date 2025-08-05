import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // 環境変数推奨

export interface JwtPayload {
    employeeId: number;
    // 必要なら他の情報も追加可能
}

/**
 * JWTを発行する関数
 * @param payload - JWTに含めるペイロード（ユーザ情報など）
 * @param expiresIn - 有効期限（秒 or 文字列、例："1h"）
 * @returns 発行したJWTトークン文字列
 */
export function signJwt(payload: JwtPayload, expiresIn: StringValue = "1h"): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * JWTを検証しペイロードを返す関数
 * @param token - JWTトークン文字列
 * @returns ペイロード情報 or null（検証失敗時）
 */
export function verifyJwt(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        console.error("JWT verification error:", error);
        return null;
    }
}