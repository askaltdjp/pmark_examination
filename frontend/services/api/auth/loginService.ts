import { TEmployeeRepository } from "@/lib/repositories/transaction/tEmployeeRepository";
import { signJwt } from "@/lib/utils/authUtils";

/**
 * 指定されたメールアドレスとパスワードで認証を行い、
 * 認証成功時にJWTトークンを発行して返す関数。
 * 認証失敗時はnullを返す。
 * 
 * @param emailAddress - 認証対象のメールアドレス
 * @param password - 認証対象のパスワード
 * @returns JWTトークン文字列 または 認証失敗時は null
 */
export async function authenticateEmployee(emailAddress: string, password: string) {
    // メールアドレスで従業員を検索
    const tEmployee = await TEmployeeRepository.findByEmail(emailAddress);

    // 従業員が存在しない、またはパスワードが一致しなければnullを返す
    if (!tEmployee || tEmployee.password !== password) {
        return null;
    }

    // 認証成功の場合、JWTトークンを発行して返す
    const token = await signJwt({ employeeId: tEmployee.id });
    return token;
}
