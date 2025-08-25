import { headers } from "next/headers";
import { getEmployeeFromRequest } from "@/lib/utils/employeeUtils";
import { withRedirectErrorHandler } from "@/lib/utils/withRedirectErrorHandler";
import ExamNavigator from "@/components/exam/take/ExamNavigator";

/**
 * 試験画面のサーバコンポーネント
 */
export default async function TakePage() {
    await withRedirectErrorHandler(async () => {
        // リクエストヘッダから社員情報を取得し、認証済みかを判定
        const requestHeaders = await headers();
        await getEmployeeFromRequest(requestHeaders);
    });

    return (
        <ExamNavigator />
    );
}
