import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/utils/authUtils";
import { TEmployeeRepository } from "@/lib/repositories/tEmployeeRepository";

/**
 * 認証済み従業員情報を取得する関数
 * クッキーのJWTトークンを検証し、
 * 有効であればDBから従業員情報を取得して返す
 * @returns 認証済みのTEmployeeオブジェクト、またはnull
 */
export async function getAuthEmployee() {
    // クッキーからtokenを取得
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    // JWTトークンを検証してペイロードを取得
    const payload = verifyJwt(token);
    if (!payload) return null;

    // DBからemployeeIdで従業員情報を取得
    const tEmployeeRepository = new TEmployeeRepository();
    const tEmployee = await tEmployeeRepository.findById(payload.employeeId);

    // 従業員情報がなければnull、あれば返す
    return tEmployee ?? null;
}
