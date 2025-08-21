import { redirect } from "next/navigation";
import { headers } from 'next/headers';
import { getEmployeeFromRequest } from "@/lib/utils/employeeUtils";
import ExamNavigator from '@/components/exam/take/ExamNavigator';

/**
 * 試験画面のサーバコンポーネント
 */
export default async function TakePage() {
    // リクエストヘッダから社員情報を取得
    // 社員情報が取得できなければログイン画面へリダイレクト
    const tEmployee = await (async () => {
        try {
            const requestHeaders = await headers();
            return await getEmployeeFromRequest(requestHeaders);
        } catch (error) {
            redirect("/auth/login");
        }
    })();

    return (
        <ExamNavigator />
    );
}
