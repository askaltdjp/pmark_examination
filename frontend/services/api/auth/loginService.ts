import { TEmployeeRepository } from "@/lib/repositories/tEmployeeRepository";
import { signJwt } from "@/lib/utils/authUtils";

/**
 * 指定されたメールアドレスとパスワードでユーザ認証を行い、
 * 認証成功時にJWTトークンを発行して返す関数。
 * 認証失敗時はnullを返す。
 * 
 * @param emailAddress - 認証対象のメールアドレス
 * @param password - 認証対象のパスワード
 * @returns JWTトークン文字列 または 認証失敗時は null
 */
export async function authenticateUser(emailAddress: string, password: string) {
    // メールアドレスでユーザを検索
    const tEmployeeRepository = new TEmployeeRepository();
    const tEmployee = await tEmployeeRepository.findByEmail(emailAddress);

    // ユーザが存在しない、またはパスワードが一致しなければnullを返す
    if (!tEmployee || tEmployee.password !== password) {
        return null;
    }

    // 認証成功の場合、JWTトークンを発行して返す
    const token = signJwt({ employeeId: tEmployee.id });
    return token;
}
