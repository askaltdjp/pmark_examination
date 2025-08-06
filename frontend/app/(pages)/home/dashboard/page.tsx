import { redirect } from "next/navigation";
import { headers } from 'next/headers';
import { TEmployeeRepository } from "@/lib/repositories/tEmployeeRepository";
import { EMPLOYEE_ID_HEADER } from "@/lib/constants";

/**
 * ホーム画面のサーバコンポーネント
 */
export default async function DashBoardPage() {
    // カスタムヘッダから従業員IDを取得し、数値に変換
    const requestHeaders = await headers();
    const employeeId = Number(requestHeaders.get(EMPLOYEE_ID_HEADER));

    // 従業員IDを元にDBから従業員情報を取得
    const tEmployeeRepository = new TEmployeeRepository();
    const tEmployee = await tEmployeeRepository.findById(employeeId);

    // 従業員情報が取得できなければログイン画面へリダイレクト
    if (!tEmployee) {
        redirect("/auth/login");
    }

    return (
        <p>ホーム画面</p>
    );
}