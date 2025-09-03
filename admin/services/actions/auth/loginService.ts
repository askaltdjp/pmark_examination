import { signJwt } from "@/lib/utils/authUtils";

/**
 * 指定されたログインIDとパスワードで認証を行い、
 * 認証成功時にJWTトークンを発行して返す関数。
 * 認証失敗時はnullを返す。
 * 
 * @param loginId  - 認証対象のログインID
 * @param password - 認証対象のパスワード
 * @returns JWTトークン文字列 または 認証失敗時は null
 */
export async function authenticateEmployee(loginId: string, password: string) {

    // ログインIDまたはパスワードが一致しなければnullを返す
    if (loginId != process.env.ADMIN_LOGIN_ID || password != process.env.ADMIN_LOGIN_PASSWORD) {
        return null;
    }

    // 認証成功の場合、JWTトークンを発行して返す
    const token = await signJwt({ loginId: loginId });
    return token;
}
